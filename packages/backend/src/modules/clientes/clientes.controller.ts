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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { FilterClienteDto } from './dto/filter-cliente.dto';

@Controller('clientes')
@UseGuards(JwtAuthGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateClienteDto) {
    return this.clientesService.create(dto);
  }

  @Get()
  findAll(@Query() filter: FilterClienteDto) {
    return this.clientesService.findAll(filter);
  }

  // ⚠️ Rota específica ANTES de :id para evitar conflito de parâmetro
  @Get('buscar/cpf-cnpj/:documento')
  findByCpfCnpj(@Param('documento') documento: string) {
    return this.clientesService.findByCpfCnpj(documento);
  }

  // ⚠️ Rota para buscar CEP pelo backend contornando CORS do Front
  @Get('cep/:cep')
  buscarCep(@Param('cep') cep: string) {
    return this.clientesService.buscarCep(cep);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.clientesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.clientesService.remove(id);
  }

  @Patch(':id/toggle-ativo')
  @HttpCode(HttpStatus.OK)
  toggleAtivo(@Param('id') id: string) {
    return this.clientesService.toggleAtivo(id);
  }
}
