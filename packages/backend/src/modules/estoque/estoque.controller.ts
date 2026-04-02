import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EstoqueService } from './estoque.service';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { ExtratoEstoqueDto } from './dto/extrato-estoque.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('estoque')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  // 1. Movimentação manual (Entrada/Saída/Ajuste) permitida apenas para cargos altos.
  // IMPORTANTE: 'VENDEDOR' foi excluído desta lista propositalmente.
  @Post('movimentar')
  @Roles('ADMIN', 'GERENTE', 'ESTOQUISTA')
  registrarMovimentacao(@Body() dto: CreateMovimentacaoDto, @Request() req) {
    const usuarioId = req.user.sub; // Pegando o ID do usuário gerado pelo token JWT
    return this.estoqueService.registrarMovimentacao(dto, usuarioId);
  }

  // 2. Consulta de Tabela Global de Estoque (Permitido a todos logados)
  @Get('produtos')
  findAllProdutos() {
    return this.estoqueService.findAllProdutosParaEstoque();
  }

  // 3. Consulta de Relatório de Alertas (Dashboard) (Permitido a todos logados)
  @Get('alertas/minimo')
  alertasEstoque() {
    return this.estoqueService.relatorioEstoqueBaixo();
  }

  // 4. Extrato/Histórico paginado de um produto específico (Permitido a todos logados)
  @Get('extrato/:produtoId')
  buscarExtrato(
    @Param('produtoId') produtoId: string,
    @Query() filter: ExtratoEstoqueDto,
  ) {
    return this.estoqueService.buscarExtrato(produtoId, filter);
  }
}
