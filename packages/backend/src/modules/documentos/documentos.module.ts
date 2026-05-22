import { Module } from '@nestjs/common';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './documentos.service';
import { TemplateService } from './services/template.service';
import { PdfService } from './services/pdf.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentosController],
  providers: [DocumentosService, TemplateService, PdfService],
  exports: [DocumentosService],
})
export class DocumentosModule {}
