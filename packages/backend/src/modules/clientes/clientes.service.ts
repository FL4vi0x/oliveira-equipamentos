import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { FilterClienteDto } from './dto/filter-cliente.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────────────────────
  async create(dto: CreateClienteDto) {
    // CPF/CNPJ sempre salvo sem formatação (só dígitos)
    const cpfCnpj = dto.cpfCnpj.replace(/\D/g, '');

    const existente = await this.prisma.cliente.findUnique({
      where: { cpfCnpj },
    });

    if (existente) {
      throw new ConflictException(
        `${cpfCnpj.length === 11 ? 'CPF' : 'CNPJ'} já cadastrado`,
      );
    }

    return this.prisma.cliente.create({
      data: { ...dto, cpfCnpj },
    });
  }

  // ─────────────────────────────────────────────────────────────
  // FIND ALL — com paginação + filtros
  // ─────────────────────────────────────────────────────────────
  async findAll(filter: FilterClienteDto) {
    const { page = 1, limit = 10, search, tipo, ativo } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.ClienteWhereInput = {};

    if (ativo !== undefined) where.ativo = ativo;
    if (tipo) where.tipo = tipo;

    if (search) {
      const term = search.trim();
      where.OR = [
        { nome: { contains: term, mode: 'insensitive' } },
        { nomeFantasia: { contains: term, mode: 'insensitive' } },
        { cpfCnpj: { contains: term.replace(/\D/g, ''), mode: 'insensitive' } },
        { email: { contains: term, mode: 'insensitive' } },
        { telefone: { contains: term, mode: 'insensitive' } },
        { celular: { contains: term, mode: 'insensitive' } },
        { cidade: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.cliente.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.cliente.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // FIND ONE — por ID
  // ─────────────────────────────────────────────────────────────
  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    return cliente;
  }

  // ─────────────────────────────────────────────────────────────
  // FIND BY CPF/CNPJ — lookup rápido para o PDV
  // ─────────────────────────────────────────────────────────────
  async findByCpfCnpj(cpfCnpj: string) {
    const digits = cpfCnpj.replace(/\D/g, '');
    const cliente = await this.prisma.cliente.findUnique({
      where: { cpfCnpj: digits },
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
    return cliente;
  }

  // ─────────────────────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────────────────────
  async update(id: string, dto: UpdateClienteDto) {
    await this.findOne(id);

    // Se está atualizando o CPF/CNPJ, verifica duplicidade
    if (dto.cpfCnpj) {
      const cpfCnpj = dto.cpfCnpj.replace(/\D/g, '');
      const duplicado = await this.prisma.cliente.findFirst({
        where: { cpfCnpj, id: { not: id } },
      });
      if (duplicado) {
        throw new ConflictException(
          `${cpfCnpj.length === 11 ? 'CPF' : 'CNPJ'} já cadastrado para outro cliente`,
        );
      }
      dto = { ...dto, cpfCnpj };
    }

    return this.prisma.cliente.update({
      where: { id },
      data: dto,
    });
  }

  // ─────────────────────────────────────────────────────────────
  // SOFT DELETE — preserva histórico de vendas
  // ─────────────────────────────────────────────────────────────
  async remove(id: string) {
    const cliente = await this.findOne(id);
    return this.prisma.cliente.update({
      where: { id },
      data: { ativo: !cliente.ativo },
    });
  }

  // ─────────────────────────────────────────────────────────────
  // TOGGLE ATIVO — ativação/inativação explícita
  // ─────────────────────────────────────────────────────────────
  async toggleAtivo(id: string) {
    const cliente = await this.findOne(id);
    return this.prisma.cliente.update({
      where: { id },
      data: { ativo: !cliente.ativo },
    });
  }
  // ─────────────────────────────────────────────────────────────
  // BUSCA CEP (Via Servidor para evitar CORS no Frontend)
  // ─────────────────────────────────────────────────────────────
  async buscarCep(cep: string) {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) {
      throw new ConflictException('CEP deve ter 8 dígitos');
    }

    try {
      // Usar a fetch API nativa do Node.js (v18+)
      const response = await fetch(
        `https://brasilapi.com.br/api/cep/v1/${digits}`,
      );
      if (response.ok) {
        const data = await response.json();
        return {
          endereco: data.street || '',
          bairro: data.neighborhood || '',
          cidade: data.city || '',
          estado: data.state || '',
        };
      }
    } catch (err) {
      // Ignora erro e tenta o fallback
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!response.ok) throw new ConflictException('Erro ao consultar o CEP');
      const data = await response.json();
      if (data.erro) throw new NotFoundException('CEP não encontrado');
      return {
        endereco: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      };
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      throw new ConflictException('Falha ao conectar no provedor de CEP.');
    }
  }
}
