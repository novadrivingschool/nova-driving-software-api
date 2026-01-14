// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNoContentResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokensDto } from './dto/tokens.dto';
import { Public } from './decorators/public.decorator';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login con email y password' })
  @ApiBody({
    type: LoginDto,
    examples: {
      admin: { summary: 'Login admin', value: { email: 'admin@example.com', password: 'StrongPass123' } },
      cliente: { summary: 'Login cliente', value: { email: 'cliente@example.com', password: 'StrongPass123' } },
    },
  })
  @ApiOkResponse({
    description: 'Login exitoso: retorna usuario y tokens',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  async login(@Body() dto: LoginDto) {
    console.log("LOGIN: ", dto);
    return this.authService.login(dto); // 👈 un solo argumento
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Obtener nuevo access token usando refresh token' })
  @ApiBody({
    type: RefreshTokenDto,
    examples: {
      ejemplo: {
        summary: 'Refresh con token válido',
        value: { refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  })
  @ApiOkResponse({ description: 'Tokens rotados con éxito', type: TokensDto })
  @ApiUnauthorizedResponse({ description: 'Refresh token inválido o expirado' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokensDto> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Cerrar sesión (invalida el refresh token)' })
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Logout exitoso' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  async logout(@Req() req: any): Promise<void> {
    // JwtStrategy.validate() debe retornar { userId, email, roles }
    const userId = req.user?.userId;
    await this.authService.logout(userId);
  }
}
