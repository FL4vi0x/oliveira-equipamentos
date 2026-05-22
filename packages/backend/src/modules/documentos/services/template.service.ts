import { Injectable, Logger } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private readonly templatesDir: string;
  private readonly assetsDir: string;

  /** Logos da marca em base64, prontas para usar em <img src="..."> nos templates */
  private readonly logos: {
    completa: string;
    simbolo: string;
    horizontal: string;
  };

  constructor() {
    // Tenta localizar o diretório de templates — o NestJS compila para dist/src/...
    // mas os arquivos .hbs são copiados pelo nest-cli. Testamos os caminhos possíveis.
    const templatePathsToTry = [
      path.join(__dirname, '..', 'templates'), // dist/modules/documentos/services -> dist/modules/documentos/templates
      path.join(__dirname, '..', '..', 'templates'), // dist/src/modules/documentos/services -> dist/src/modules/documentos/templates
      path.join(process.cwd(), 'src', 'modules', 'documentos', 'templates'), // quando cwd = packages/backend
      path.join(
        process.cwd(),
        'packages',
        'backend',
        'src',
        'modules',
        'documentos',
        'templates',
      ), // quando cwd = raiz do monorepo
    ];

    const foundTemplatePath = templatePathsToTry.find((p) => fs.existsSync(p));
    this.templatesDir = foundTemplatePath || templatePathsToTry[0];

    if (!foundTemplatePath) {
      this.logger.warn(
        `Diretório de templates não encontrado nos locais esperados. Usando fallback: ${this.templatesDir}`,
      );
    }

    // Assets (logos) são SEMPRE lidas do src/, pois não são compiladas pelo TypeScript.
    // O NestJS não copia imagens .png para o dist — por isso não derivamos do templatesDir.
    const assetsPathsToTry = [
      path.join(__dirname, '..', 'templates', 'assets'), // dist/.../services -> dist/.../templates/assets
      path.join(__dirname, '..', '..', 'templates', 'assets'), // dist/src/.../services -> dist/src/.../templates/assets
      path.join(
        process.cwd(),
        'src',
        'modules',
        'documentos',
        'templates',
        'assets',
      ), // cwd = packages/backend
      path.join(
        process.cwd(),
        'packages',
        'backend',
        'src',
        'modules',
        'documentos',
        'templates',
        'assets',
      ), // cwd = raiz
      // Caminho absoluto ancorado no __dirname: sobe até encontrar src/
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'src',
        'modules',
        'documentos',
        'templates',
        'assets',
      ),
    ];

    const foundAssetsPath = assetsPathsToTry.find((p) => fs.existsSync(p));
    this.assetsDir = foundAssetsPath || assetsPathsToTry[2]; // fallback = cwd/src/...

    this.logger.log(
      `Templates: ${this.templatesDir} | Assets: ${this.assetsDir} (existe: ${fs.existsSync(this.assetsDir)})`,
    );

    // Carrega logos em base64 uma única vez na inicialização
    this.logos = this.loadLogos();

    this.registerHelpers();
  }

  // =========================================================
  // HELPERS HANDLEBARS
  // =========================================================

  private registerHelpers(): void {
    /**
     * Formata um valor Decimal/number para moeda BRL sem o símbolo R$
     * com SEMPRE 2 casas decimais. Ex: 179.8 => "179,80"
     */
    Handlebars.registerHelper(
      'formatCurrency2',
      (value: number | string | null | undefined) => {
        const num = Number(value) || 0;
        return new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num);
      },
    );

    /**
     * Formata um valor Decimal/number para moeda BRL completa
     * Ex: 7500 => "R$ 7.500,00"
     */
    Handlebars.registerHelper(
      'formatCurrency',
      (value: number | string | null | undefined) => {
        const num = Number(value) || 0;
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(num);
      },
    );

    /**
     * Formata uma data ISO para dd/mm/yyyy
     */
    Handlebars.registerHelper(
      'formatDate',
      (value: Date | string | null | undefined) => {
        if (!value) return '—';
        const d = new Date(value);
        if (isNaN(d.getTime())) return '—';
        return d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      },
    );

    /**
     * Formata uma data ISO por extenso em português
     * Ex: 2026-07-02 => "2 de Julho de 2026"
     * Também aceita prefixo de dias: "Aos X dias do mês de Julho de 2026"
     */
    Handlebars.registerHelper(
      'formatDateExtenso',
      (value: Date | string | null | undefined) => {
        if (!value) return '—';
        const d = new Date(value);
        if (isNaN(d.getTime())) return '—';
        const dia = d.getUTCDate();
        const mes = d.toLocaleDateString('pt-BR', {
          month: 'long',
          timeZone: 'UTC',
        });
        const mesCapital = mes.charAt(0).toUpperCase() + mes.slice(1);
        const ano = d.getUTCFullYear();
        return `${dia} de ${mesCapital} de ${ano}`;
      },
    );

    /**
     * Formata data por extenso no estilo "Aos X dias do mês de Julho de 2026"
     */
    Handlebars.registerHelper(
      'formatDateExtensoAos',
      (value: Date | string | null | undefined) => {
        if (!value) return '—';
        const d = new Date(value);
        if (isNaN(d.getTime())) return '—';
        const dia = d.getUTCDate();
        const mes = d.toLocaleDateString('pt-BR', {
          month: 'long',
          timeZone: 'UTC',
        });
        const mesCapital = mes.charAt(0).toUpperCase() + mes.slice(1);
        const ano = d.getUTCFullYear();
        return `Aos ${dia} dias do mês de ${mesCapital} de ${ano}`;
      },
    );

    /**
     * Formata quantidade decimal: remove zeros à direita
     * Ex: 1.000 => "1", 2.500 => "2,5"
     */
    Handlebars.registerHelper(
      'formatQuantidade',
      (value: number | string | null | undefined) => {
        const num = Number(value) || 0;
        return new Intl.NumberFormat('pt-BR', {
          maximumFractionDigits: 3,
          minimumFractionDigits: 0,
        }).format(num);
      },
    );

    /**
     * Retorna index + 1 (1-based index para tabelas)
     */
    Handlebars.registerHelper('incrementedIndex', (index: number) => index + 1);

    /**
     * Divide um array em grupos de N elementos (para o grid de promissórias)
     * {{#chunk parcelas 3}}...{{/chunk}}
     */
    Handlebars.registerHelper(
      'chunk',
      (array: unknown[], size: number, options: Handlebars.HelperOptions) => {
        if (!Array.isArray(array)) return '';
        const chunks: unknown[][] = [];
        for (let i = 0; i < array.length; i += size) {
          chunks.push(array.slice(i, i + size));
        }
        return chunks.map((chunk) => options.fn(chunk)).join('');
      },
    );

    /**
     * Preenche slots vazios em uma folha de promissórias
     * Garante que cada folha tenha sempre N células
     * CORRIGIDO: usa {} em vez de this (this apontava para TemplateService)
     */
    Handlebars.registerHelper(
      'fillEmptySlots',
      (
        array: unknown[],
        maxSize: number,
        options: Handlebars.HelperOptions,
      ) => {
        const remaining = maxSize - (array?.length ?? 0);
        if (remaining <= 0) return '';
        return Array.from({ length: remaining }, () => options.fn({})).join('');
      },
    );

    this.logger.log('Handlebars helpers registrados com sucesso.');
  }

  // =========================================================
  // LEITURA E COMPILAÇÃO DE TEMPLATES
  // =========================================================

  /**
   * Lê e compila um template Handlebars pelo nome do arquivo (sem extensão)
   */
  private compileTemplate(templateName: string): Handlebars.TemplateDelegate {
    const filePath = path.join(this.templatesDir, `${templateName}.hbs`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Template não encontrado: ${filePath}`);
    }

    const source = fs.readFileSync(filePath, 'utf-8');
    return Handlebars.compile(source);
  }

  // =========================================================
  // LOGOS / ASSETS
  // =========================================================

  /**
   * Converte uma imagem do disco para URI data:image/png;base64,…
   * Retorna string vazia (sem quebrar) se o arquivo não existir.
   */
  private imageToBase64(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      this.logger.warn(`Logo não encontrada em: ${filePath}`);
      return '';
    }
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).replace('.', '').toLowerCase();
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    return `data:${mime};base64,${buffer.toString('base64')}`;
  }

  /**
   * Carrega as 3 logos da pasta assets em base64.
   * Chamado uma única vez no construtor.
   */
  private loadLogos() {
    const logos = {
      completa: this.imageToBase64(
        path.join(this.assetsDir, 'logo-oe-completa.png'),
      ),
      simbolo: this.imageToBase64(
        path.join(this.assetsDir, 'logo-oe-simbolo.png'),
      ),
      horizontal: this.imageToBase64(
        path.join(this.assetsDir, 'logo-oe-horizontal.png'),
      ),
    };

    const loaded = Object.entries(logos)
      .filter(([, v]) => v !== '')
      .map(([k]) => k);

    this.logger.log(
      `Logos carregadas: [${loaded.join(', ')}] — assets: ${this.assetsDir}`,
    );

    return logos;
  }

  // =========================================================
  // RENDERIZAÇÃO
  // =========================================================

  /**
   * Renderiza um template com os dados fornecidos.
   * O objeto `logos` é injetado automaticamente em todos os templates.
   */
  render(templateName: string, data: Record<string, unknown>): string {
    const template = this.compileTemplate(templateName);
    return template({ logos: this.logos, ...data });
  }

  /**
   * Renderiza o layout base (base.hbs) envolvendo o conteúdo gerado
   */
  renderWithBase(content: string): string {
    const baseTemplate = this.compileTemplate('base');
    return baseTemplate({ content });
  }
}
