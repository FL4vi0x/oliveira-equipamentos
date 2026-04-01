import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TipoMovimentacao } from '@prisma/client';

export class CreateMovimentacaoDto {
  @IsUUID('4', { message: 'ID de produto inválido' })
  @IsNotEmpty({ message: 'Produto é obrigatório' })
  produtoId: string;

  @IsEnum(TipoMovimentacao, { message: 'Tipo de movimentação inválido' })
  @IsNotEmpty({ message: 'Tipo da movimentação é obrigatório' })
  tipo: TipoMovimentacao;

  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(0.001, { message: 'Quantidade deve ser maior que zero' })
  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  quantidade: number;

  @IsString({ message: 'Motivo deve ser texto' })
  @IsOptional()
  motivo?: string;
}
