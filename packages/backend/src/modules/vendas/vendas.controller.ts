import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { VendasService } from './vendas.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { FilterVendaDto } from './dto/filter-venda.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vendas')
@UseGuards(JwtAuthGuard)
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  async criarVenda(@Request() req, @Body() dto: CreateVendaDto) {
    return this.vendasService.criarVenda(req.user.id, dto);
  }

  @Get()
  async findAll(@Query() filter: FilterVendaDto) {
    return this.vendasService.findAll(filter);
  }

  @Get('hoje')
  async getVendasHoje(@Request() req) {
    return this.vendasService.getVendasDoDia(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vendasService.findOne(id);
  }

  @Patch(':id/cancelar')
  async cancelar(@Param('id') id: string) {
    return this.vendasService.cancelar(id);
  }
}
