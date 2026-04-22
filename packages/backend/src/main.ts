import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Segurança com Helmet
  app.use(helmet());

  // CORS para Electron e Web configurável
  const corsOrigins = configService.get<string[]>('CORS_ORIGINS');

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global prefix para API
  app.setGlobalPrefix('api');

  // Validação automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger OpenAPI Config
  const config = new DocumentBuilder()
    .setTitle('Oliveira ERP API')
    .setDescription(
      'Documentação viva da API do ERP Oliveira Equipamentos (Fase 2)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const port = configService.get<number>('BACKEND_PORT') || 3001;
  await app.listen(port);

  console.log(`🚀 Backend rodando em: http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
});
