import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { TemplateService } from './services/template.service';
import { PdfService } from './services/pdf.service';
import { GerarDocumentoDto } from './dto/gerar-documento.dto';
import { Prisma } from '@prisma/client';

// =========================================================
// TYPES INTERNOS
// =========================================================

interface ParcelaData {
  numero: number;
  totalParcelas: number;
  valor: number;
  vencimento: Date;
  descricaoVenda: string;
  valorPorExtenso: string; // calculado individualmente por parcela
}

type ContextoBase = Record<string, unknown> & {
  venda: {
    id: string;
    numero: number;
    dataVenda: Date;
    subtotal: Prisma.Decimal;
    desconto: Prisma.Decimal;
    total: Prisma.Decimal;
    observacoes: string | null;
  };
  cliente: {
    nome: string;
    cpfCnpj: string;
    telefone: string | null;
    celular: string | null;
    endereco: string | null;
    numero: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
    cep: string | null;
  };
  empresa: {
    nome: string;
    cnpj: string;
    telefone: string | null;
    email: string | null;
    endereco: string | null;
    numero: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
    cep: string | null;
  };
  usuario: { nome: string };
  itens: Array<{
    produto: { nome: string };
    quantidade: Prisma.Decimal;
    precoUnitario: Prisma.Decimal;
    subtotal: Prisma.Decimal;
    desconto: Prisma.Decimal;
    total: Prisma.Decimal;
  }>;
  parcelas: ParcelaData[];
  folhas: ParcelaData[][];
  localPagamento: string;
  valorEntrada: number;
  numeroParcelas: number;
  valorParcela: number;
  totalParcelado: number;
  primeiroVencimento: Date;
  ultimoVencimento: Date;
  valorPorExtenso: string;
  numeroPorExtenso: string;
  anoAtual: number;
  geradoEm: Date;
};

@Injectable()
export class DocumentosService {
  private readonly logger = new Logger(DocumentosService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly templateService: TemplateService,
    private readonly pdfService: PdfService,
    private readonly configService: ConfigService,
  ) {}

  // =========================================================
  // MÉTODO PRINCIPAL
  // =========================================================

  async gerarDocumentos(
    vendaId: string,
    dto: GerarDocumentoDto,
    usuarioId: string,
  ): Promise<Buffer> {
    this.logger.log(`Iniciando geração de documentos para venda: ${vendaId}`);

    // 1. Busca dados completos da venda
    const venda = await this.buscarVendaCompleta(vendaId);

    // 2. Valida cliente
    if (!venda.cliente) {
      throw new BadRequestException(
        'A venda não possui cliente associado. Não é possível gerar documentos.',
      );
    }

    // 3. Busca dados da empresa
    const empresa = await this.buscarEmpresa();

    // 4. Calcula parcelas
    const { parcelas, valorParcela, totalParcelado, dataInicioParcelas } =
      this.calcularParcelas(venda.total, dto);

    // 5. Persiste parcelas no banco
    await this.persistirParcelas(vendaId, parcelas, dto.numeroParcelas);

    // 6. Persiste ContaReceber (total geral da venda a prazo)
    await this.persistirContaReceber(venda, dto, totalParcelado);

    // 7. Monta contexto compartilhado para os templates
    const contexto = this.montarContexto(
      venda,
      empresa,
      parcelas,
      dto,
      valorParcela,
      totalParcelado,
      dataInicioParcelas,
    );

    // 8. Renderiza cada seção do documento
    const secoes: string[] = [
      this.templateService.render('contrato-produtos', contexto),
      this.templateService.render('termo-entrega', contexto),
      this.templateService.render('contrato-compra-venda', contexto),
      this.templateService.render('contrato-pagamento', contexto),
      this.templateService.render('promissorias', contexto),
    ];

    // 9. Une todas as seções e embala no layout base
    const htmlFinal = this.templateService.renderWithBase(secoes.join('\n'));

    // 10. Gera PDF
    const pdfBuffer = await this.pdfService.htmlToPdf(htmlFinal);

    // 11. Registra no AuditLog
    await this.registrarAuditoria(
      vendaId,
      usuarioId,
      pdfBuffer.byteLength,
      dto,
    );

    this.logger.log(
      `Documentos gerados com sucesso — venda: ${vendaId} — ${pdfBuffer.byteLength} bytes`,
    );

    return pdfBuffer;
  }

  // =========================================================
  // BUSCA DE DADOS
  // =========================================================

  private async buscarVendaCompleta(vendaId: string) {
    const venda = await this.prisma.venda.findUnique({
      where: { id: vendaId },
      include: {
        cliente: true,
        usuario: { select: { nome: true } },
        itens: {
          include: {
            produto: {
              select: { nome: true, unidadeMedida: true },
            },
          },
        },
        pagamentos: true,
      },
    });

    if (!venda) {
      throw new NotFoundException(`Venda não encontrada: ${vendaId}`);
    }

    return venda;
  }

  private async buscarEmpresa() {
    // 1. Prioriza a leitura via ConfigService (.env)
    const nomeEnv = this.configService.get<string>('EMPRESA_NOME');

    if (nomeEnv) {
      this.logger.debug('Lendo dados da empresa das variáveis de ambiente.');
      return {
        nome: nomeEnv,
        cnpj: this.configService.get<string>('EMPRESA_CNPJ') || '',
        telefone: this.configService.get<string>('EMPRESA_TELEFONE') || '',
        email: this.configService.get<string>('EMPRESA_EMAIL') || '',
        endereco: this.configService.get<string>('EMPRESA_ENDERECO') || '',
        numero: this.configService.get<string>('EMPRESA_NUMERO') || '',
        bairro: this.configService.get<string>('EMPRESA_BAIRRO') || '',
        cidade: this.configService.get<string>('EMPRESA_CIDADE') || '',
        estado: this.configService.get<string>('EMPRESA_ESTADO') || '',
        cep: this.configService.get<string>('EMPRESA_CEP') || '',
      };
    }

    // 2. Fallback para integração futura com tabela Empresa no banco
    this.logger.debug('Tentando ler dados da empresa do banco de dados.');
    const empresa = await this.prisma.empresa.findFirst();
    if (!empresa) {
      throw new BadRequestException(
        'Nenhuma empresa cadastrada no sistema. Configure os dados da empresa no .env ou no banco de dados antes de gerar documentos.',
      );
    }
    return empresa;
  }

  // =========================================================
  // CÁLCULO DE PARCELAS
  // =========================================================

  private calcularParcelas(totalVenda: Prisma.Decimal, dto: GerarDocumentoDto) {
    const total = Number(totalVenda);
    const valorEntrada = dto.valorEntrada ?? 0;
    const totalParcelado = total - valorEntrada;

    if (totalParcelado < 0) {
      throw new BadRequestException(
        'O valor da entrada não pode ser maior que o total da venda.',
      );
    }

    const { numeroParcelas } = dto;

    // Valor com arredondamento: última parcela absorve centavos restantes
    const valorParcelaBase =
      Math.floor((totalParcelado / numeroParcelas) * 100) / 100;
    const totalBase = valorParcelaBase * (numeroParcelas - 1);
    const valorUltimaParcela =
      Math.round((totalParcelado - totalBase) * 100) / 100;

    // Data de início: padrão = próximo sábado
    const dataInicioParcelas = dto.dataInicio
      ? new Date(dto.dataInicio + 'T12:00:00')
      : this.proximoSabado();

    const parcelas: ParcelaData[] = Array.from(
      { length: numeroParcelas },
      (_, i) => {
        const vencimento = new Date(dataInicioParcelas);
        vencimento.setDate(vencimento.getDate() + i * 7); // +7 dias por parcela
        const valor =
          i === numeroParcelas - 1 ? valorUltimaParcela : valorParcelaBase;

        return {
          numero: i + 1,
          totalParcelas: numeroParcelas,
          valor,
          vencimento,
          descricaoVenda: 'Compra parcelada',
          valorPorExtenso: this.valorParaExtenso(valor), // <-- por parcela
        };
      },
    );

    return {
      parcelas,
      valorParcela: valorParcelaBase,
      totalParcelado,
      dataInicioParcelas,
    };
  }

  private proximoSabado(): Date {
    const hoje = new Date();
    // Configura para meio-dia no horário de Brasília
    hoje.setHours(12, 0, 0, 0);
    const diaSemana = hoje.getDay(); // 0=Dom, 1=Seg, ..., 6=Sab
    // Se hoje já é sábado (6), a primeira cobrança deve ser no próximo (daqui a 7 dias)
    const diasAteSabado = diaSemana === 6 ? 7 : 6 - diaSemana;
    hoje.setDate(hoje.getDate() + diasAteSabado);
    return hoje;
  }

  // =========================================================
  // PERSISTÊNCIA
  // =========================================================

  private async persistirParcelas(
    vendaId: string,
    parcelas: ParcelaData[],
    totalParcelas: number,
  ): Promise<void> {
    // Verifica se já existem parcelas para não duplicar
    const existentes = await this.prisma.parcelaVenda.count({
      where: { vendaId },
    });

    if (existentes > 0) {
      this.logger.warn(
        `Parcelas já existentes para venda ${vendaId}. Removendo e recriando.`,
      );
      await this.prisma.parcelaVenda.deleteMany({ where: { vendaId } });
    }

    await this.prisma.parcelaVenda.createMany({
      data: parcelas.map((p) => ({
        vendaId,
        numero: p.numero,
        totalParcelas,
        valor: new Prisma.Decimal(p.valor),
        vencimento: p.vencimento,
        status: 'PENDENTE',
      })),
    });

    this.logger.log(
      `${parcelas.length} parcelas persistidas para venda ${vendaId}`,
    );
  }

  private async persistirContaReceber(
    venda: Awaited<ReturnType<typeof this.buscarVendaCompleta>>,
    dto: GerarDocumentoDto,
    totalParcelado: number,
  ): Promise<void> {
    // Remove conta anterior se existir para a mesma venda
    await this.prisma.contaReceber.deleteMany({
      where: { vendaId: venda.id },
    });

    const dataUltimaParcela = dto.dataInicio
      ? new Date(dto.dataInicio + 'T12:00:00')
      : this.proximoSabado();

    dataUltimaParcela.setDate(
      dataUltimaParcela.getDate() + (dto.numeroParcelas - 1) * 7,
    );

    await this.prisma.contaReceber.create({
      data: {
        descricao: `Venda Nº ${venda.numero} — ${venda.cliente?.nome ?? 'Cliente'} — ${dto.numeroParcelas}x semanais`,
        valor: new Prisma.Decimal(totalParcelado),
        vencimento: dataUltimaParcela,
        vendaId: venda.id,
        status: 'PENDENTE',
      },
    });
  }

  private async registrarAuditoria(
    vendaId: string,
    usuarioId: string,
    tamanhoBytes: number,
    dto: GerarDocumentoDto,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        acao: 'GERAR_DOCUMENTOS',
        entidade: 'Venda',
        entidadeId: vendaId,
        usuarioId,
        payload: {
          numeroParcelas: dto.numeroParcelas,
          valorEntrada: dto.valorEntrada ?? 0,
          dataInicio: dto.dataInicio,
          pdfBytes: tamanhoBytes,
        },
      },
    });
  }

  // =========================================================
  // MONTAGEM DO CONTEXTO
  // =========================================================

  private montarContexto(
    venda: Awaited<ReturnType<typeof this.buscarVendaCompleta>>,
    empresa: Awaited<ReturnType<typeof this.buscarEmpresa>>,
    parcelas: ParcelaData[],
    dto: GerarDocumentoDto,
    valorParcela: number,
    totalParcelado: number,
    dataInicioParcelas: Date,
  ): ContextoBase {
    // folhas[] mantido para compatibilidade com outros templates (ex: contratos)
    const folhas: ParcelaData[][] = [];
    for (let i = 0; i < parcelas.length; i += 4) {
      folhas.push(parcelas.slice(i, i + 4));
    }

    const ultimoVencimento =
      parcelas[parcelas.length - 1]?.vencimento ?? dataInicioParcelas;

    // Local de pagamento = Cidade - UF da empresa
    const localPagamento = [empresa.cidade, empresa.estado]
      .filter(Boolean)
      .join(' - ');

    return {
      venda: {
        id: venda.id,
        numero: venda.numero,
        dataVenda: venda.dataVenda,
        subtotal: venda.subtotal,
        desconto: venda.desconto,
        total: venda.total,
        observacoes: venda.observacoes,
      },
      cliente: {
        nome: venda.cliente!.nome,
        cpfCnpj: venda.cliente!.cpfCnpj,
        telefone: venda.cliente!.telefone,
        celular: venda.cliente!.celular,
        endereco: venda.cliente!.endereco,
        numero: venda.cliente!.numero,
        bairro: venda.cliente!.bairro,
        cidade: venda.cliente!.cidade,
        estado: venda.cliente!.estado,
        cep: venda.cliente!.cep,
      },
      empresa: {
        nome: empresa.nome,
        cnpj: empresa.cnpj,
        telefone: empresa.telefone,
        email: empresa.email,
        endereco: empresa.endereco,
        numero: empresa.numero,
        bairro: empresa.bairro,
        cidade: empresa.cidade,
        estado: empresa.estado,
        cep: empresa.cep,
      },
      usuario: { nome: venda.usuario.nome },
      itens: venda.itens,
      parcelas,
      folhas,
      localPagamento,
      valorEntrada: dto.valorEntrada ?? 0,
      numeroParcelas: dto.numeroParcelas,
      valorParcela,
      totalParcelado,
      primeiroVencimento: dataInicioParcelas,
      ultimoVencimento,
      valorPorExtenso: this.valorParaExtenso(Number(venda.total)),
      numeroPorExtenso: this.numeroParaExtenso(dto.numeroParcelas),
      anoAtual: new Date().getFullYear(),
      geradoEm: new Date(),
    };
  }

  // =========================================================
  // UTILITÁRIOS DE TEXTO
  // =========================================================

  private valorParaExtenso(valor: number): string {
    // Implementação simplificada — suficiente para valores comerciais comuns
    const reais = Math.floor(valor);
    const centavos = Math.round((valor - reais) * 100);

    const partes: string[] = [];
    if (reais > 0) partes.push(`${this.inteiroParaExtenso(reais)} reais`);
    if (centavos > 0)
      partes.push(`${this.inteiroParaExtenso(centavos)} centavos`);

    return partes.join(' e ') || 'zero reais';
  }

  private inteiroParaExtenso(n: number): string {
    if (n === 0) return 'zero';

    const unidades = [
      '',
      'um',
      'dois',
      'três',
      'quatro',
      'cinco',
      'seis',
      'sete',
      'oito',
      'nove',
      'dez',
      'onze',
      'doze',
      'treze',
      'quatorze',
      'quinze',
      'dezesseis',
      'dezessete',
      'dezoito',
      'dezenove',
    ];
    const dezenas = [
      '',
      '',
      'vinte',
      'trinta',
      'quarenta',
      'cinquenta',
      'sessenta',
      'setenta',
      'oitenta',
      'noventa',
    ];
    const centenas = [
      '',
      'cento',
      'duzentos',
      'trezentos',
      'quatrocentos',
      'quinhentos',
      'seiscentos',
      'setecentos',
      'oitocentos',
      'novecentos',
    ];

    if (n === 100) return 'cem';
    if (n < 20) return unidades[n];
    if (n < 100) {
      const dez = Math.floor(n / 10);
      const uni = n % 10;
      return uni === 0 ? dezenas[dez] : `${dezenas[dez]} e ${unidades[uni]}`;
    }
    if (n < 1000) {
      const cen = Math.floor(n / 100);
      const resto = n % 100;
      return resto === 0
        ? centenas[cen]
        : `${centenas[cen]} e ${this.inteiroParaExtenso(resto)}`;
    }
    if (n < 1000000) {
      const mil = Math.floor(n / 1000);
      const resto = n % 1000;
      const milExtenso =
        mil === 1 ? 'mil' : `${this.inteiroParaExtenso(mil)} mil`;
      return resto === 0
        ? milExtenso
        : `${milExtenso} e ${this.inteiroParaExtenso(resto)}`;
    }
    return n.toString();
  }

  private numeroParaExtenso(n: number): string {
    return this.inteiroParaExtenso(n);
  }
}
