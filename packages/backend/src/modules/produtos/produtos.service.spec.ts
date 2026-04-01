import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockProduto = {
  id: 'uuid-1',
  codigoInterno: 'P001',
  nome: 'Furadeira',
  categoria: { id: 'cat-1', nome: 'Ferramentas' },
  unidadeMedida: 'UN',
  precoCompra: 100,
  precoVenda: 150,
  margemLucro: 50,
  estoqueAtual: 10,
  estoqueMinimo: 2,
  estoqueMaximo: null,
  codigoBarras: null,
  descricao: null,
  ativo: true,
  ncm: null,
  cest: null,
  observacoes: null,
  categoriaId: 'cat-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProdutosService', () => {
  let service: ProdutosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            produto: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            categoria: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProdutosService>(ProdutosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar { data, meta } com paginação correta', async () => {
      (prisma.$transaction as jest.Mock).mockResolvedValue([[mockProduto], 1]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].nome).toBe('Furadeira');
    });

    it('deve calcular totalPages corretamente para múltiplas páginas', async () => {
      (prisma.$transaction as jest.Mock).mockResolvedValue([[], 25]);

      const result = await service.findAll({ page: 2, limit: 10 });

      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.page).toBe(2);
      expect(result.meta.total).toBe(25);
    });
  });
});
