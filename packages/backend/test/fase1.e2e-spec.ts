import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import helmet from 'helmet';

describe('ERP Fase 1 (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testUser: any;
  const testPassword = 'TestPassword123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(helmet());
    prisma = app.get(PrismaService);
    await app.init();

    // Criar usuário de teste limpo
    const email = `test-${uuidv4()}@example.com`;
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    testUser = await prisma.usuario.create({
      data: {
        email,
        nome: 'QA Tester',
        cpf: Math.random().toString().substring(2, 13),
        senha: hashedPassword,
        perfil: 'ADMIN',
      },
    });
  });

  afterAll(async () => {
    if (testUser) {
      // Limpar dados de teste (em ordem de dependência)
      await prisma.venda.deleteMany({ where: { usuarioId: testUser.id } });
      await prisma.caixaRegistro.deleteMany({
        where: { usuarioId: testUser.id },
      });
      await prisma.usuario.delete({ where: { id: testUser.id } });
    }
    await app.close();
  });

  describe('Autenticação e Segurança', () => {
    let accessToken: string;
    let refreshToken: string;

    it('Deve realizar login com sucesso e retornar tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ login: testUser.email, senha: testPassword })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      accessToken = response.body.access_token;
      refreshToken = response.body.refresh_token;
    });

    it('Deve retornar 401 para senha incorreta', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ login: testUser.email, senha: 'wrong-password' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Deve possuir os headers de segurança do Helmet', async () => {
      const response = await request(app.getHttpServer()).get('/api/produtos');
      expect(response.headers).toHaveProperty(
        'x-content-type-options',
        'nosniff',
      );
      expect(response.headers).toHaveProperty('x-dns-prefetch-control', 'off');
    });

    it('Deve realizar o refresh do token e hashear o novo token no banco', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refresh_token: refreshToken })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');

      const newRefreshToken = response.body.refresh_token;

      // Validar que o token no banco está hashado
      const dbUser = await prisma.usuario.findUnique({
        where: { id: testUser.id },
      });
      expect(dbUser?.refreshToken).not.toBe(newRefreshToken);
      const isMatch = await bcrypt.compare(
        newRefreshToken,
        dbUser?.refreshToken || '',
      );
      expect(isMatch).toBe(true);

      refreshToken = newRefreshToken; // Atualiza para o próximo teste
    });

    it('Deve invalidar o token no Logout', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

      const dbUser = await prisma.usuario.findUnique({
        where: { id: testUser.id },
      });
      expect(dbUser?.refreshToken).toBeNull();

      // Tentar usar o refresh token após logout deve falhar
      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refresh_token: refreshToken })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Domínio (Produtos e Caixa)', () => {
    let authToken: string;

    beforeAll(async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ login: testUser.email, senha: testPassword });

      expect(loginRes.status).toBe(HttpStatus.OK);
      authToken = loginRes.body.access_token;
    });

    it('Deve realizar Soft Delete em um produto', async () => {
      // 1. Criar produto para deletar
      const cat = await prisma.categoria.upsert({
        where: { nome: 'Teste E2E' },
        update: {},
        create: { nome: 'Teste E2E' },
      });

      const produto = await prisma.produto.create({
        data: {
          nome: 'Produto Teste Delete',
          codigoInterno: `T-${uuidv4().substring(0, 8)}`,
          precoCompra: 10,
          precoVenda: 20,
          margemLucro: 100,
          unidadeMedida: 'UN',
          categoriaId: cat.id,
        },
      });

      // 2. Deletar
      await request(app.getHttpServer())
        .delete(`/api/produtos/${produto.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NO_CONTENT);

      // 3. Validar que ainda existe no banco mas está inativo
      const dbProd = await prisma.produto.findUnique({
        where: { id: produto.id },
      });
      expect(dbProd).toBeDefined();
      expect(dbProd?.ativo).toBe(false);

      // Limpeza
      await prisma.produto.delete({ where: { id: produto.id } });
    });

    it('Deve calcular corretamente o saldo de fechamento do caixa', async () => {
      // 1. Abrir Caixa
      const abrirRes = await request(app.getHttpServer())
        .post('/api/estoque/caixas/abrir')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ saldoAbertura: 150.0 })
        .expect(HttpStatus.CREATED);

      const caixaId = abrirRes.body.id;

      // 2. Criar uma venda concluída para este caixa
      await prisma.venda.create({
        data: {
          usuarioId: testUser.id,
          caixaId: caixaId,
          subtotal: 50.0,
          desconto: 0,
          total: 50.0,
          status: 'CONCLUIDA',
        },
      });

      // 3. Fechar Caixa
      const fecharRes = await request(app.getHttpServer())
        .patch(`/api/estoque/caixas/${caixaId}/fechar`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(Number(fecharRes.body.totalVendas)).toBe(50.0);
      expect(Number(fecharRes.body.saldoFechamento)).toBe(200.0); // 150 + 50
    });
  });

  it('Deve aplicar Rate Limiting no Login (Simulação rápida)', async () => {
    // Como o limite é 10, vamos disparar 11 vezes
    const promises = Array.from({ length: 12 }).map(() =>
      request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ login: testUser.email, senha: testPassword }),
    );

    const results = await Promise.all(promises);
    const rateLimited = results.some((res) => res.status === 429);
    expect(rateLimited).toBe(true);
  });
});
