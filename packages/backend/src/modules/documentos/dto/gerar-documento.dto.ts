import {
  IsInt,
  IsNumber,
  IsOptional,
  IsDateString,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GerarDocumentoDto {
  @ApiProperty({
    description: 'Número total de parcelas semanais',
    example: 30,
    minimum: 1,
    maximum: 104, // máximo ~2 anos
  })
  @IsInt({ message: 'numeroParcelas deve ser um número inteiro' })
  @Min(1, { message: 'Mínimo de 1 parcela' })
  @Max(104, { message: 'Máximo de 104 parcelas (2 anos)' })
  @Type(() => Number)
  numeroParcelas: number;

  @ApiPropertyOptional({
    description: 'Valor da entrada (padrão: 0)',
    example: 500,
    default: 0,
  })
  @IsNumber({}, { message: 'valorEntrada deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'valorEntrada não pode ser negativo' })
  @Type(() => Number)
  valorEntrada?: number = 0;

  @ApiPropertyOptional({
    description:
      'Data de vencimento da primeira parcela (ISO 8601). Padrão: próximo sábado.',
    example: '2025-05-05',
  })
  @IsDateString(
    {},
    { message: 'dataInicio deve ser uma data válida (YYYY-MM-DD)' },
  )
  @IsOptional()
  dataInicio?: string;

  @ApiPropertyOptional({
    description: 'Observações adicionais sobre a geração do documento',
    example: 'Cliente solicitou parcelamento especial.',
  })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
