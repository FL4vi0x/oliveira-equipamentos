import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosController } from './produtos.controller';

describe('ProdutosController', () => {
  let controller: ProdutosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutosController],
      providers: [
        {
          provide: 'ProdutosService',
          useValue: {}, // Mock simples
        },
      ],
    }).compile();

    controller = module.get<ProdutosController>(ProdutosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
