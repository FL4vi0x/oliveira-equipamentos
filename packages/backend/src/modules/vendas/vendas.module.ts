import { Module } from '@nestjs/common';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';
import { CaixaModule } from '../caixa/caixa.module';

@Module({
  imports: [CaixaModule],
  controllers: [VendasController],
  providers: [VendasService],
})
export class VendasModule {}
