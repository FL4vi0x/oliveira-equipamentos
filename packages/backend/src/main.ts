import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
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

  const port = configService.get<number>('BACKEND_PORT') || 3001;
  await app.listen(port);

  console.log(`🚀 Backend rodando em: http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
});
