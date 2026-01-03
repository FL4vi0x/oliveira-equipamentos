import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ProdutosService', () => {
  let service: ProdutosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: PrismaService,
          useValue: {}, // Mock vazio
        },
      ],
    }).compile();

    service = module.get<ProdutosService>(ProdutosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
