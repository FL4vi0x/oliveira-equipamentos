import {
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { PerfilUsuario } from '@prisma/client';

export class CreateUsuarioDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(11)
  cpf: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsEnum(PerfilUsuario)
  perfil: PerfilUsuario;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissoes?: string[];

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
