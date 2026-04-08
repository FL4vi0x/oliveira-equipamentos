import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FormaPagamento, StatusVenda } from '@prisma/client';

export class PagamentoVendaDto {
  @IsEnum(FormaPagamento, { message: 'Forma de pagamento inválida' })
  @IsNotEmpty({ message: 'Forma de pagamento é obrigatória' })
  formaPagamento: FormaPagamento;

  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0.01, { message: 'Valor mínimo é 0.01' })
  valor: number;
}

export class ItemVendaDto {
  @IsUUID('4', { message: 'ID do produto inválido' })
  @IsNotEmpty({ message: 'ID do produto é obrigatório' })
  produtoId: string;

  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(0.001, { message: 'Quantidade mínima é 0.001' })
  quantidade: number;

  @IsNumber({}, { message: 'Preço unitário deve ser um número' })
  @Min(0, { message: 'Preço unitário não pode ser negativo' })
  precoUnitario: number;

  @IsNumber({}, { message: 'Desconto deve ser um número' })
  @IsOptional()
  desconto?: number;
}

export class CreateVendaDto {
  @IsUUID('4', { message: 'ID do cliente inválido' })
  @IsOptional()
  clienteId?: string;

  @IsEnum(StatusVenda, { message: 'Status de venda inválido' })
  @IsOptional()
  status?: StatusVenda;

  @IsArray({ message: 'Pagamentos devem ser uma lista' })
  @IsNotEmpty({ message: 'Pelo menos uma forma de pagamento é obrigatória' })
  @ValidateNested({ each: true })
  @Type(() => PagamentoVendaDto)
  pagamentos: PagamentoVendaDto[];

  @IsNumber({}, { message: 'Desconto total deve ser um número' })
  @IsOptional()
  descontoGeral?: number;

  @IsString({ message: 'Observações deve ser um texto' })
  @IsOptional()
  observacoes?: string;

  @IsArray({ message: 'Itens da venda devem ser uma lista' })
  @ValidateNested({ each: true })
  @Type(() => ItemVendaDto)
  itens: ItemVendaDto[];
}
