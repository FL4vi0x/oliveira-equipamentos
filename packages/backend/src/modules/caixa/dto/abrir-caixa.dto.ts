import { IsNumber, Min } from 'class-validator';

export class AbrirCaixaDto {
  @IsNumber({}, { message: 'Saldo deve ser numérico' })
  @Min(0, { message: 'Saldo de abertura não pode ser negativo' })
  saldoAbertura: number;
}
