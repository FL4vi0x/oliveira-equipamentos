import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AbrirCaixaDto } from './dto/abrir-caixa.dto';

@Injectable()
export class CaixaService {
  constructor(private prisma: PrismaService) {}

  async getAtivo(usuarioId: string) {
    const caixa = await this.prisma.caixaRegistro.findFirst({
      where: {
        usuarioId,
        status: 'ABERTO',
      },
    });
    return caixa;
  }

  async abrirCaixa(usuarioId: string, dto: AbrirCaixaDto) {
    const caixaAtivo = await this.getAtivo(usuarioId);
    if (caixaAtivo) {
      throw new BadRequestException('Usuário já possui um caixa aberto.');
    }

    return this.prisma.caixaRegistro.create({
      data: {
        usuarioId,
        saldoAbertura: dto.saldoAbertura,
        status: 'ABERTO',
      },
    });
  }

  async fecharCaixa(caixaId: string) {
    const caixa = await this.prisma.caixaRegistro.findUnique({
      where: { id: caixaId },
    });

    if (!caixa) {
      throw new NotFoundException('Caixa não encontrado');
    }
    if (caixa.status === 'FECHADO') {
      throw new BadRequestException('Caixa já está fechado');
    }

    return this.prisma.caixaRegistro.update({
      where: { id: caixaId },
      data: {
        status: 'FECHADO',
        dataFechamento: new Date(),
        // TODO: Mudar subtotal de fechamento para bater com totalVendas
      },
    });
  }
}
