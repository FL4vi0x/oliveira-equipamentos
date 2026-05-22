import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  Res,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { DocumentosService } from './documentos.service';
import { GerarDocumentoDto } from './dto/gerar-documento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Documentos')
@ApiBearerAuth()
@Controller('documentos')
@UseGuards(JwtAuthGuard)
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  /**
   * POST /documentos/gerar/:vendaId
   *
   * Gera um PDF único contendo:
   * 1. Contrato de Produtos
   * 2. Termo de Entrega
   * 3. Contrato de Compra e Venda com Reserva de Domínio
   * 4. Contrato de Pagamento
   * 5. Promissórias (4 por folha A4)
   */
  @Post('gerar/:vendaId')
  @ApiOperation({
    summary: 'Gerar documentos de venda em PDF',
    description:
      'Gera um único PDF contendo contrato de produtos, termo de entrega, contrato de compra e venda, contrato de pagamento e promissórias. Persiste as parcelas no banco de dados.',
  })
  @ApiParam({
    name: 'vendaId',
    description: 'UUID da venda',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'PDF gerado com sucesso (application/pdf)',
    content: {
      'application/pdf': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Venda não encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
  })
  async gerarDocumentos(
    @Param('vendaId', new ParseUUIDPipe({ version: '4' })) vendaId: string,
    @Body() dto: GerarDocumentoDto,
    @Request() req: { user: { id: string; nome: string } },
    @Res() res: Response,
  ): Promise<void> {
    const pdfBuffer = await this.documentosService.gerarDocumentos(
      vendaId,
      dto,
      req.user.id,
    );

    const nomeArquivo = `documentos-venda-${vendaId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${nomeArquivo}"`,
    );
    res.setHeader('Content-Length', pdfBuffer.byteLength);
    res.setHeader('Cache-Control', 'no-store');
    res.status(HttpStatus.OK).send(pdfBuffer);
  }
}
