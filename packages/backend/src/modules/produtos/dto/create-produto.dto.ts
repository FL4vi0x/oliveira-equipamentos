import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  codigoInterno: string;

  @IsString()
  @IsOptional()
  codigoBarras?: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsUUID()
  @IsNotEmpty()
  categoriaId: string;

  @IsString()
  @IsNotEmpty()
  unidadeMedida: string;

  @IsNumber()
  @Min(0)
  precoCompra: number;

  @IsNumber()
  @Min(0)
  precoVenda: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  estoqueAtual?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  estoqueMinimo?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  estoqueMaximo?: number;

  @IsString()
  @IsOptional()
  ncm?: string;

  @IsString()
  @IsOptional()
  cest?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;
}
