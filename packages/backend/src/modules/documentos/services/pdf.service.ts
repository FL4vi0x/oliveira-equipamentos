import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  /**
   * Converte um HTML completo em um Buffer PDF A4,
   * pronto para ser enviado como application/pdf.
   */
  async htmlToPdf(html: string): Promise<Buffer> {
    let browser: Browser | null = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--font-render-hinting=none',
        ],
      });

      const page = await browser.newPage();

      // Injeta o HTML completo (com CSS inline já embutido)
      await page.setContent(html, {
        waitUntil: 'networkidle0', // espera assets carregarem (fontes, etc.)
      });

      // Emula mídia de impressão para acionar @media print
      await page.emulateMediaType('print');

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
        // Deixa o CSS controlar margens via .page padding
        preferCSSPageSize: true,
      });

      this.logger.log(
        `PDF gerado com sucesso — tamanho: ${pdfBuffer.byteLength} bytes`,
      );

      return Buffer.from(pdfBuffer);
    } catch (err) {
      this.logger.error('Falha ao gerar PDF com Puppeteer', err);
      throw new InternalServerErrorException(
        'Não foi possível gerar o PDF. Tente novamente.',
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
