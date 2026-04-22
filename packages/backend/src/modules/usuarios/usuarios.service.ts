import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<Omit<Usuario, 'senha'>> {
    const { senha, ...rest } = createUsuarioDto;

    const emailExists = await this.findByEmail(rest.email);
    if (emailExists) throw new ConflictException('E-mail já está em uso.');

    const cpfExists = await this.prisma.usuario.findUnique({
      where: { cpf: rest.cpf },
    });
    if (cpfExists) throw new ConflictException('CPF já está em uso.');

    const hashedPassword = await bcrypt.hash(senha, 10);
    const usuario = await this.prisma.usuario.create({
      data: {
        ...rest,
        senha: hashedPassword,
      },
    });

    const result = usuario as any;
    delete result.senha;
    delete result.refreshToken;
    return result;
  }

  async findAll(): Promise<Omit<Usuario, 'senha' | 'refreshToken'>[]> {
    const usuarios = await this.prisma.usuario.findMany();
    return usuarios.map((u) => {
      const result = u as any;
      delete result.senha;
      delete result.refreshToken;
      return result;
    });
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Omit<Usuario, 'senha'>> {
    const data: any = { ...updateUsuarioDto };

    if (data.email) {
      const existing = await this.findByEmail(data.email);
      if (existing && existing.id !== id)
        throw new ConflictException('E-mail já está em uso.');
    }

    if (data.cpf) {
      const existing = await this.prisma.usuario.findUnique({
        where: { cpf: data.cpf },
      });
      if (existing && existing.id !== id)
        throw new ConflictException('CPF já está em uso.');
    }

    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    const usuario = await this.prisma.usuario.update({
      where: { id },
      data,
    });

    const result = usuario as any;
    delete result.senha;
    delete result.refreshToken;
    return result;
  }

  async toggleAtivo(id: string): Promise<Omit<Usuario, 'senha'>> {
    const usuario = await this.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const updated = await this.prisma.usuario.update({
      where: { id },
      data: { ativo: !usuario.ativo },
    });

    const result = updated as any;
    delete result.senha;
    delete result.refreshToken;
    return result;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async findByLogin(login: string): Promise<Usuario | null> {
    if (login.includes('@')) {
      return this.prisma.usuario.findUnique({
        where: { email: login },
      });
    }

    const cpf = login.replace(/\D/g, '');
    return this.prisma.usuario.findUnique({
      where: { cpf },
    });
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.prisma.usuario.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async findById(id: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }
}
