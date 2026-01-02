import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { FilterProdutoDto } from './dto/filter-produto.dto';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(createProdutoDto);
  }

  @Get()
  findAll(@Query() filter: FilterProdutoDto) {
    return this.produtosService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtosService.update(id, updateProdutoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.produtosService.remove(id);
  }

  @Get('buscar/codigo-barras/:codigo')
  findByCodigoBarras(@Param('codigo') codigo: string) {
    return this.produtosService.findByCodigoBarras(codigo);
  }

  @Get('categorias/listar')
  listCategorias() {
    return this.produtosService.listCategorias();
  }
}