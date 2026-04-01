import {
  IsEnum,
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoCliente } from '@prisma/client';
import { CpfCnpjConstraint } from './cpfCnpj.constraint';

export class UpdateClienteDto {
  @IsOptional()
  @IsEnum(['FISICA', 'JURIDICA'])
  tipo?: TipoCliente;

  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'Informe CPF (11 dígitos) ou CNPJ (14 dígitos) sem formatação',
  })
  @Validate(CpfCnpjConstraint)
  cpfCnpj?: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  celular?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  complemento?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres (ex: SP)' })
  estado?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve ter 8 dígitos sem formatação' })
  cep?: string;

  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @IsOptional()
  @IsString()
  inscricaoEstadual?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  ativo?: boolean;
}
