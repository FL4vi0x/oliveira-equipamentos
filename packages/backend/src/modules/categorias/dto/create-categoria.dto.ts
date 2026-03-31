import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nome: string;
}
