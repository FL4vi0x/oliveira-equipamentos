import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { CaixaModule } from './modules/caixa/caixa.module';
import { VendasModule } from './modules/vendas/vendas.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    UsuariosModule,
    AuthModule,
    ProdutosModule,
    CategoriasModule,
    ClientesModule,
    EstoqueModule,
    CaixaModule,
    VendasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
