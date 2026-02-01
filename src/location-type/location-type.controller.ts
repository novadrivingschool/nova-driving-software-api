import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationTypeService } from './location-type.service';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';
import { UpdateLocationTypeDto } from './dto/update-location-type.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Location Types')
@Controller('location-type')
export class LocationTypeController {
  constructor(private readonly locationTypeService: LocationTypeService) { }

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo tipo de ubicación',
    description: 'Registra una nueva categoría para las ubicaciones (ej. Sucursal, Almacén).'
  })
  @ApiResponse({ status: 201, description: 'Tipo de ubicación creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'El código del tipo de ubicación ya existe.' })
  @ApiResponse({ status: 500, description: 'Error interno al crear el registro.' })
  create(@Body() createLocationTypeDto: CreateLocationTypeDto) {
    return this.locationTypeService.create(createLocationTypeDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar todos los tipos de ubicación',
    description: 'Obtiene el listado completo de categorías de ubicación registradas.'
  })
  @ApiResponse({ status: 200, description: 'Registros obtenidos exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error al obtener los registros.' })
  findAll() {
    return this.locationTypeService.findAll();
  }

  @Public()
  @Get(':uuid')
  @ApiOperation({
    summary: 'Obtener tipo de ubicación por UUID',
    description: 'Busca una categoría específica por su identificador único.'
  })
  @ApiParam({ name: 'uuid', description: 'UUID del registro' })
  @ApiResponse({ status: 200, description: 'Tipo de ubicación encontrado.' })
  @ApiResponse({ status: 404, description: 'No se encontró el tipo de ubicación.' })
  findOne(@Param('uuid') uuid: string) {
    return this.locationTypeService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  @ApiOperation({
    summary: 'Actualizar tipo de ubicación',
    description: 'Modifica los datos de una categoría de ubicación existente.'
  })
  @ApiParam({ name: 'uuid', description: 'UUID del registro a actualizar' })
  @ApiBody({ type: UpdateLocationTypeDto })
  @ApiResponse({ status: 200, description: 'Tipo de ubicación actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'No se enviaron datos para actualizar.' })
  @ApiResponse({ status: 409, description: 'El código del tipo de ubicación ya existe.' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la ubicación.' })
  update(@Param('uuid') uuid: string, @Body() updateLocationTypeDto: UpdateLocationTypeDto) {
    return this.locationTypeService.update(uuid, updateLocationTypeDto);
  }

  @Public()
  @Delete(':uuid')
  @ApiOperation({
    summary: 'Eliminar tipo de ubicación',
    description: 'Elimina permanentemente una categoría de la base de datos.'
  })
  @ApiParam({ name: 'uuid', description: 'UUID del registro a eliminar' })
  @ApiResponse({ status: 200, description: 'Tipo de ubicación eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Tipo de ubicación no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error al eliminar el registro.' })
  remove(@Param('uuid') uuid: string) {
    return this.locationTypeService.remove(uuid);
  }
}