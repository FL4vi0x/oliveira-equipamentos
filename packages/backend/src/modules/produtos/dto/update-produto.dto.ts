import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto } from './create-produto.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {
    @IsBoolean()
    @IsOptional()
    ativo?: boolean;
}