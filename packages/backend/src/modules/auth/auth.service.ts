import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usuariosService: UsuariosService,
        private jwtService: JwtService,
    ) { }

    async validateUser(login: string, pass: string): Promise<any> {
        const usuario = await this.usuariosService.findByLogin(login);
        if (usuario && (await bcrypt.compare(pass, usuario.senha))) {
            const { senha, ...result } = usuario;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.login, loginDto.senha);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            nome: user.nome,
            perfil: user.perfil,
        };

        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' }); // Long lived

        // In a real app we should hash the refresh token before saving
        await this.usuariosService.updateRefreshToken(user.id, refresh_token);

        return {
            access_token,
            refresh_token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                perfil: user.perfil,
            },
        };
    }

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.usuariosService.findById(payload.sub);

            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedException('Refresh token inválido');
            }

            const newPayload = {
                sub: user.id,
                email: user.email,
                nome: user.nome,
                perfil: user.perfil,
            };

            const access_token = this.jwtService.sign(newPayload);
            const new_refresh_token = this.jwtService.sign(newPayload, {
                expiresIn: '7d',
            });

            await this.usuariosService.updateRefreshToken(user.id, new_refresh_token);

            return {
                access_token,
                refresh_token: new_refresh_token,
            };
        } catch {
            throw new UnauthorizedException('Refresh token inválido');
        }
    }
}
