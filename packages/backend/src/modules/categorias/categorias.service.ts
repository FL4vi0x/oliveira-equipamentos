import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const existe = await this.prisma.categoria.findUnique({
      where: { nome: createCategoriaDto.nome },
    });

    if (existe) {
      throw new ConflictException('Uma categoria com este nome já existe');
    }

    return this.prisma.categoria.create({
      data: createCategoriaDto,
    });
  }

  async findAll() {
    const categorias = await this.prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
      include: {
        _count: {
          select: { produtos: true },
        },
      },
    });

    return categorias.map((c) => ({
      id: c.id,
      nome: c.nome,
      produtosCount: c._count.produtos,
    }));
  }

  async findOne(id: string) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
    });
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return categoria;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    await this.findOne(id);

    if (updateCategoriaDto.nome) {
      const existe = await this.prisma.categoria.findFirst({
        where: {
          nome: updateCategoriaDto.nome,
          id: { not: id },
        },
      });
      if (existe) {
        throw new ConflictException('Uma categoria com este nome já existe');
      }
    }

    return this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const checkProdutos = await this.prisma.produto.count({
      where: { categoriaId: id },
    });

    if (checkProdutos > 0) {
      throw new BadRequestException(
        'Não é possível excluir a categoria pois existem produtos associados a ela',
      );
    }

    await this.prisma.categoria.delete({
      where: { id },
    });

    return { message: 'Categoria removida com sucesso' };
  }
}
