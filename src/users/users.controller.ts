import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  NotFoundException,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersFilterDto } from './dto/users-filter.dto';

@ApiTags('users')
@ApiBearerAuth() // 👈 Swagger mostrará que requiere Bearer token (guard global ya lo exige)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  // Si quisieras permitir registro público, podrías abrirlo con:
  // @Public()
  @Post()
  @HttpCode(201)
  @ApiBody({
    description: 'Payload para crear usuario',
    type: CreateUserDto,
    examples: {
      admin: {
        summary: 'Crear admin',
        value: { email: 'admin@example.com', password: 'StrongPass123', roles: ['admin'], isActive: true },
      },
      customer: {
        summary: 'Crear cliente',
        value: { email: 'cliente@example.com', password: 'StrongPass123' },
      },
    },
  })
  @ApiCreatedResponse({ type: User, description: 'Usuario creado exitosamente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o email ya registrado' })
  create(@Body() dto: CreateUserDto) {
    console.log("CREATE..... ", dto);
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: User, isArray: true, description: 'Lista de usuarios' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiOkResponse({ type: User, description: 'Usuario autenticado actual' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async getMe(@Req() req: any) {
    console.log("GET ME.....", req)
    // Toma el id tal como viene hoy del guard (userId),
    // con fallbacks por si en otro flujo expone id o sub.
    const id: string | undefined = req.user?.userId ?? req.user?.id ?? req.user?.sub;

    if (!id) {
      throw new UnauthorizedException('Missing user id in request user payload');
    }

    const user = await this.usersService.findOne(id); // ya carga relations: { profile: true }
    console.log("USER.....", user);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get('filter')
  @ApiOkResponse({
    type: User,
    isArray: true,
    description: 'Usuarios filtrados por estado activo/inactivo',
  })
  filterByActive(@Query() dto: UsersFilterDto) {
    return this.usersService.filter(dto);
  }

  @Get(':id')
  @ApiOkResponse({ type: User, description: 'Usuario encontrado' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Patch(':id')
  @ApiBody({
    description: 'Campos a actualizar (todos opcionales)',
    type: UpdateUserDto,
    examples: {
      emailYRoles: { summary: 'Cambiar email y roles', value: { email: 'nuevo@example.com', roles: ['employee'] } },
      password: { summary: 'Cambiar password', value: { password: 'NewPass123' } },
      desactivar: { summary: 'Desactivar usuario', value: { isActive: false } },
    },
  })
  @ApiOkResponse({ type: User, description: 'Usuario actualizado' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o sin campos para actualizar' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    console.log("UPDATE..... ", dto);
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Usuario eliminado' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
