import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CaixaService } from './caixa.service';
import { AbrirCaixaDto } from './dto/abrir-caixa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Caixa PDV')
@ApiBearerAuth()
@Controller('estoque/caixas') // Mantendo padrão de rotas do ERP
@UseGuards(JwtAuthGuard)
export class CaixaController {
  constructor(private readonly caixaService: CaixaService) {}

  @Get('ativo')
  async getAtivo(@Request() req) {
    return this.caixaService.getAtivo(req.user.id);
  }

  @Post('abrir')
  async abrir(@Request() req, @Body() dto: AbrirCaixaDto) {
    return this.caixaService.abrirCaixa(req.user.id, dto);
  }

  @Patch(':id/fechar')
  async fechar(@Param('id') id: string) {
    return this.caixaService.fecharCaixa(id);
  }
}
