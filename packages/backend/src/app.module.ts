import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UsuariosModule,
    AuthModule,
    ProdutosModule,
    CategoriasModule,
    ClientesModule,
    EstoqueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
