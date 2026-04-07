import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusVenda, FormaPagamento } from '@prisma/client';

export class FilterVendaDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(StatusVenda)
  @IsOptional()
  status?: StatusVenda;

  @IsEnum(FormaPagamento)
  @IsOptional()
  formaPagamento?: FormaPagamento;

  @IsString()
  @IsOptional()
  dataInicio?: string;

  @IsString()
  @IsOptional()
  dataFim?: string;
}
