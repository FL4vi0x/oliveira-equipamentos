import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { FilterProdutoDto } from './dto/filter-produto.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  async create(createProdutoDto: CreateProdutoDto) {
    // Verificar se código interno já existe
    const existeCodigoInterno = await this.prisma.produto.findUnique({
      where: { codigoInterno: createProdutoDto.codigoInterno },
    });

    if (existeCodigoInterno) {
      throw new ConflictException('Código interno já cadastrado');
    }

    // Verificar se código de barras já existe (se fornecido)
    if (createProdutoDto.codigoBarras) {
      const existeCodigoBarras = await this.prisma.produto.findUnique({
        where: { codigoBarras: createProdutoDto.codigoBarras },
      });

      if (existeCodigoBarras) {
        throw new ConflictException('Código de barras já cadastrado');
      }
    }

    // Calcular margem de lucro
    const margemLucro =
      ((createProdutoDto.precoVenda - createProdutoDto.precoCompra) /
        createProdutoDto.precoCompra) *
      100;

    const produto = await this.prisma.produto.create({
      data: {
        ...createProdutoDto,
        margemLucro,
        estoqueAtual: createProdutoDto.estoqueAtual || 0,
        estoqueMinimo: createProdutoDto.estoqueMinimo || 0,
      },
      include: {
        categoria: true,
      },
    });

    return produto;
  }

  async findAll(filter: FilterProdutoDto) {
    const { page = 1, limit = 10, search, categoriaId, ativo } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.ProdutoWhereInput = {};

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (search) {
      where.OR = [
        { codigoInterno: { contains: search, mode: 'insensitive' } },
        { codigoBarras: { contains: search, mode: 'insensitive' } },
        { nome: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await this.prisma.produto.findMany({
      where,
      include: {
        categoria: true,
      },
      orderBy: {
        nome: 'asc',
      },
      skip,
      take: limit,
    });
  }

  async findOne(id: string) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    return produto;
  }

  async findByCodigoBarras(codigoBarras: string) {
    const produto = await this.prisma.produto.findUnique({
      where: { codigoBarras },
      include: {
        categoria: true,
      },
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    return produto;
  }

  async update(id: string, updateProdutoDto: UpdateProdutoDto) {
    // Verificar se produto existe
    await this.findOne(id);

    // Verificar duplicação de código interno
    if (updateProdutoDto.codigoInterno) {
      const existeCodigoInterno = await this.prisma.produto.findFirst({
        where: {
          codigoInterno: updateProdutoDto.codigoInterno,
          id: { not: id },
        },
      });

      if (existeCodigoInterno) {
        throw new ConflictException('Código interno já cadastrado');
      }
    }

    // Verificar duplicação de código de barras
    if (updateProdutoDto.codigoBarras) {
      const existeCodigoBarras = await this.prisma.produto.findFirst({
        where: {
          codigoBarras: updateProdutoDto.codigoBarras,
          id: { not: id },
        },
      });

      if (existeCodigoBarras) {
        throw new ConflictException('Código de barras já cadastrado');
      }
    }

    // Recalcular margem de lucro se os preços mudaram
    let margemLucro: number | undefined;
    if (updateProdutoDto.precoCompra || updateProdutoDto.precoVenda) {
      const produtoAtual = await this.prisma.produto.findUnique({
        where: { id },
      });

      const precoCompra =
        updateProdutoDto.precoCompra || produtoAtual!.precoCompra;
      const precoVenda =
        updateProdutoDto.precoVenda || produtoAtual!.precoVenda;

      margemLucro =
        ((Number(precoVenda) - Number(precoCompra)) / Number(precoCompra)) *
        100;
    }

    const produto = await this.prisma.produto.update({
      where: { id },
      data: {
        ...updateProdutoDto,
        ...(margemLucro !== undefined && { margemLucro }),
      },
      include: {
        categoria: true,
      },
    });

    return produto;
  }

  async remove(id: string) {
    // Verificar se produto existe
    await this.findOne(id);

    await this.prisma.produto.delete({
      where: { id },
    });

    return { message: 'Produto removido com sucesso' };
  }

  async toggleAtivo(id: string) {
    const produto = await this.findOne(id);

    return this.prisma.produto.update({
      where: { id },
      data: { ativo: !produto.ativo },
      include: {
        categoria: true,
      },
    });
  }

  async listCategorias() {
    return await this.prisma.categoria.findMany({
      orderBy: {
        nome: 'asc',
      },
    });
  }
}
