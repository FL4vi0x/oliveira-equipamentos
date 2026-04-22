import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';
import { sanitizePayload } from '../utils/audit-sanitizer.util';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, originalUrl, ip, body } = request;

    // Ignore GET requests and authentication routes
    if (method === 'GET' || originalUrl.includes('/auth/')) {
      return next.handle();
    }

    const userAgent = request.headers['user-agent'] || '';
    const user = request.user; // Set by JwtAuthGuard
    const usuarioId = user?.id || null;

    // Determine Action
    let acao = 'UNKNOWN';
    if (method === 'POST') acao = 'CREATE';
    if (method === 'PUT' || method === 'PATCH') acao = 'UPDATE';
    if (method === 'DELETE') acao = 'DELETE';

    // Determine Entity from route (e.g., /api/produtos -> produtos)
    const routeParts = originalUrl.split('?')[0].split('/').filter(Boolean);
    // Ignore global prefix 'api'
    const entityIndex = routeParts[0] === 'api' ? 1 : 0;
    const entidade = routeParts[entityIndex] || 'system';

    // Attempt to extract entity ID from route params or body
    const entidadeId = request.params?.id || body?.id || null;

    const sanitizedPayload = sanitizePayload(body);

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Success response
          const response = ctx.getResponse();
          const statusCode = response.statusCode;

          // If it was a CREATE, the ID might be in the response data
          const finalEntityId = entidadeId || data?.id || null;

          void this.logAudit({
            acao,
            entidade,
            entidadeId: finalEntityId,
            usuarioId,
            payload: sanitizedPayload,
            metodo: method,
            rota: originalUrl,
            statusCode,
            ip,
            userAgent,
          });
        },
        error: (error) => {
          // Error response
          const statusCode = error?.status || 500;
          void this.logAudit({
            acao,
            entidade,
            entidadeId,
            usuarioId,
            payload: sanitizedPayload,
            metodo: method,
            rota: originalUrl,
            statusCode,
            ip,
            userAgent,
          });
        },
      }),
    );
  }

  private async logAudit(data: any) {
    try {
      await this.prisma.auditLog.create({
        data,
      });
    } catch (error) {
      this.logger.error('Failed to create AuditLog', error);
    }
  }
}
