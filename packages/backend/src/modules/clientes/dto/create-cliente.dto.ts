import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { TipoCliente } from '@prisma/client';
import { CpfCnpjConstraint } from './cpfCnpj.constraint';

export class CreateClienteDto {
  @IsEnum(['FISICA', 'JURIDICA'], {
    message: 'Tipo deve ser FISICA ou JURIDICA',
  })
  @IsNotEmpty()
  tipo: TipoCliente;

  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF/CNPJ é obrigatório' })
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'Informe CPF (11 dígitos) ou CNPJ (14 dígitos) sem formatação',
  })
  @Validate(CpfCnpjConstraint)
  cpfCnpj: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  celular?: string;

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  numero?: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  @IsOptional()
  bairro?: string;

  @IsString()
  @IsOptional()
  cidade?: string;

  @IsString()
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres (ex: SP)' })
  @IsOptional()
  estado?: string;

  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve ter 8 dígitos sem formatação' })
  @IsOptional()
  cep?: string;

  // Campos exclusivos Pessoa Jurídica
  @IsString()
  @IsOptional()
  nomeFantasia?: string;

  @IsString()
  @IsOptional()
  inscricaoEstadual?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;
}
