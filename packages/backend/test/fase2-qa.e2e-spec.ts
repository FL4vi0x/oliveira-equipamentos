import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

describe('QA Validation - Fase 2 (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let adminToken: string;
  let vendedorToken: string;
  let adminId: string;
  let testUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    app.setGlobalPrefix('api');
    app.use(helmet());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    // Mock Swagger to ensure it works
    const config = new DocumentBuilder().setTitle('Test').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();

    // Setup: Limpar base e criar usuários de teste
    await prisma.auditLog.deleteMany();
    await prisma.usuario.deleteMany({
      where: { email: { contains: 'qa-test' } },
    });

    // Helper para gerar token no banco diretamente para criar o primeiro admin
    const senhaHash = await bcrypt.hash('Senha123!', 10);

    const admin = await prisma.usuario.create({
      data: {
        nome: 'Admin QA',
        email: 'admin@qa-test.com',
        cpf: '00000000001',
        senha: senhaHash,
        perfil: 'ADMIN',
      },
    });
    adminId = admin.id;

    await prisma.usuario.create({
      data: {
        nome: 'Vendedor QA',
        email: 'vendedor@qa-test.com',
        cpf: '00000000002',
        senha: senhaHash,
        perfil: 'VENDEDOR',
      },
    });

    // Fazer login para pegar os tokens
    const resAdmin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ login: 'admin@qa-test.com', senha: 'Senha123!' });
    adminToken = resAdmin.body.access_token;

    const resVendedor = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ login: 'vendedor@qa-test.com', senha: 'Senha123!' });
    vendedorToken = resVendedor.body.access_token;
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({
      where: { email: { contains: 'qa-test' } },
    });
    await app.close();
  });

  describe('3. RBAC (CRÍTICO)', () => {
    it('VENDEDOR não deve poder criar usuário (HTTP 403)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${vendedorToken}`)
        .send({
          nome: 'Test',
          email: 'test@qa-test.com',
          cpf: '00000000003',
          senha: '123',
          perfil: 'VENDEDOR',
        });
      expect(res.status).toBe(403);
    });

    it('ADMIN deve poder criar usuário (HTTP 201)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nome: 'New User QA',
          email: 'newuser@qa-test.com',
          cpf: '00000000003',
          senha: 'SenhaSec123!',
          perfil: 'VENDEDOR',
        });
      expect(res.status).toBe(201);
      testUserId = res.body.id;
    });
  });

  describe('2. Validação da Auditoria e Sanitização (CRÍTICO)', () => {
    it('Deve ter gerado log de CREATE ao criar usuário e mascarar senha', async () => {
      // Espera um pouco para garantir que o log assíncrono salvou
      await new Promise((r) => setTimeout(r, 100));

      const logs = await prisma.auditLog.findMany({
        where: { acao: 'CREATE', entidade: 'usuarios', usuarioId: adminId },
      });

      expect(logs.length).toBeGreaterThan(0);
      const logCreate = logs[logs.length - 1];

      expect(logCreate.statusCode).toBe(201);
      expect(logCreate.metodo).toBe('POST');
      expect(logCreate.entidadeId).toBe(testUserId);

      // Sanitização: A senha deve ser mascarada
      const payload: any = logCreate.payload;
      expect(payload.senha).toBe('[FILTERED]');
      expect(payload.nome).toBe('New User QA');
    });

    it('Não deve gerar log em operações GET', async () => {
      const countAntes = await prisma.auditLog.count({
        where: { usuarioId: adminId },
      });

      await request(app.getHttpServer())
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${adminToken}`);

      await new Promise((r) => setTimeout(r, 100));
      const countDepois = await prisma.auditLog.count({
        where: { usuarioId: adminId },
      });

      expect(countDepois).toBe(countAntes);
    });

    it('Deve gerar log de UPDATE ao desativar usuário (PATCH)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/usuarios/${testUserId}/toggle-ativo`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      await new Promise((r) => setTimeout(r, 100));
      const logs = await prisma.auditLog.findMany({
        where: { acao: 'UPDATE', entidade: 'usuarios', entidadeId: testUserId },
      });

      expect(logs.length).toBe(1);
    });
  });

  describe('4. Usuário Inativo', () => {
    it('Usuário desativado não deve conseguir fazer login (HTTP 403)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ login: 'newuser@qa-test.com', senha: 'SenhaSec123!' });

      // A implementação feita no AuthService usa ForbiddenException (403)
      expect(res.status).toBe(403);
    });
  });

  describe('5. Dashboard', () => {
    it('Deve retornar dados agregados do sistema (HTTP 200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/resumo')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('vendas');
      expect(res.body).toHaveProperty('produtos');
      expect(res.body).toHaveProperty('caixa');
      expect(typeof res.body.produtos.estoqueBaixo).toBe('number');
    });
  });

  describe('6. Swagger', () => {
    it('Rota /api/docs-json deve retornar as especificações do OpenAPI', async () => {
      const res = await request(app.getHttpServer()).get('/api/docs-json');
      expect(res.status).toBe(200);
      expect(res.body.openapi).toBeDefined();
    });
  });
});
