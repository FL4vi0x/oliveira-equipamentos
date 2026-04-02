import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VendasService } from './vendas.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vendas')
@UseGuards(JwtAuthGuard)
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post()
  async criarVenda(@Request() req, @Body() dto: CreateVendaDto) {
    return this.vendasService.criarVenda(req.user.id, dto);
  }

  @Get('hoje')
  async getVendasHoje(@Request() req) {
    return this.vendasService.getVendasDoDia(req.user.id);
  }
}
