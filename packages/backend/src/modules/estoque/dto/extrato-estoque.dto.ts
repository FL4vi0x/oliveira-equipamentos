import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ExtratoEstoqueDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'A página deve ser um número' })
  @Min(1, { message: 'A página mínima é 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'O limite deve ser um número' })
  @Min(1, { message: 'O limite mínimo é 1' })
  @Max(100, { message: 'O limite máximo é 100' })
  limit?: number = 10;
}
