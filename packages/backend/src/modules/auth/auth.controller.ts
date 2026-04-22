import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Realiza o login de um usuário e retorna tokens de acesso',
  })
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Gera novos tokens a partir de um refresh token válido',
  })
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invalida a sessão atual do usuário' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return { message: 'Logout realizado com sucesso' };
  }
}
