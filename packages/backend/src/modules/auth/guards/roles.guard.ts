import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PerfilUsuario } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<PerfilUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se a rota não tem roles especificadas, ela é pública para usuários autenticados
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Se não há usuário na request (não tem JWT) ou se o token não tiver 'perfil'
    if (!user || (!user.perfil && !user.role)) {
      throw new ForbiddenException(
        'Usuário não autenticado ou sem perfil definido',
      );
    }

    // Compatibilidade caso o payload carregue role ou perfil
    const userRole = user.perfil || user.role;

    const hasRole = requiredRoles.includes(userRole as PerfilUsuario);
    if (!hasRole) {
      throw new ForbiddenException(
        'Acesso negado: seu perfil não tem permissão para esta ação',
      );
    }
    return true;
  }
}
