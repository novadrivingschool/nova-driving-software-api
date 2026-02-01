import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { HighschoolsService } from './highschools.service';
import { CreateHighschoolDto } from './dto/create-highschool.dto';
import { UpdateHighschoolDto } from './dto/update-highschool.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateHighschoolStatus } from './dto/update-highschool-status.dto';
import { ApiOperation, ApiParam, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('High Schools')
@Controller('highschools')
export class HighschoolsController {
  constructor(private readonly highschoolsService: HighschoolsService) { }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo colegio', description: 'Crea un nuevo registro de High School en el sistema' })
  @ApiResponse({ status: 201, description: 'Colegio creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Cuerpo de la petición inválido.' })
  @ApiResponse({ status: 409, description: 'El código del colegio (highschool_id) ya existe.' })
  create(@Body() createHighschoolDto: CreateHighschoolDto) {
    return this.highschoolsService.create(createHighschoolDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener lista de colegios', description: 'Retorna todos los colegios registrados activos e inactivos' })
  @ApiResponse({ status: 200, description: 'Listado obtenido con éxito.' })
  findAll() {
    return this.highschoolsService.findAll();
  }

  @Public()
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener un colegio por su UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID único del colegio' })
  @ApiResponse({ status: 200, description: 'Colegio encontrado correctamente.' })
  @ApiResponse({ status: 404, description: 'Colegio no encontrado.' })
  findOne(@Param('uuid') uuid: string) {
    return this.highschoolsService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  @ApiOperation({ summary: 'Actualizar datos de un colegio', description: 'Permite modificar cualquier campo del colegio excepto su UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID del colegio a actualizar' })
  @ApiBody({ type: UpdateHighschoolDto })
  @ApiResponse({ status: 200, description: 'Datos del colegio actualizados con éxito.' })
  @ApiResponse({ status: 404, description: 'No se encontró el colegio para actualizar.' })
  update(@Param('uuid') uuid: string, @Body() updateHighschoolDto: UpdateHighschoolDto) {
    return this.highschoolsService.update(uuid, updateHighschoolDto);
  }

  @Public()
  @Patch(':uuid/status')
  @ApiOperation({ summary: 'Habilitar o deshabilitar un colegio', description: 'Actualizar el status de un colegio' })
  @ApiParam({ name: 'uuid', description: 'UUID del colegio a habilitar/deshabilitar' })
  @ApiBody({ type: UpdateHighschoolStatus })
  @ApiResponse({ status: 200, description: 'Estado del colegio actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Colegio no encontrado.' })
  updateStatus(@Param('uuid') uuid: string, @Body() updateStatusDto: UpdateHighschoolStatus) {
    return this.highschoolsService.updateStatus(uuid, updateStatusDto)
  }
}