import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async findByLogin(login: string): Promise<Usuario | null> {
    // Remove characters if it looks like a formatted CPF, but simplistic check for now
    // Assuming login can be email OR cpf (clean numbers)

    // Check if it's an email
    if (login.includes('@')) {
      return this.prisma.usuario.findUnique({
        where: { email: login },
      });
    }

    // Otherwise assume CPF (strip non-numeric just in case)
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
