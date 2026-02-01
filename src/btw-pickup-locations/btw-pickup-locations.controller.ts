import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BtwPickupLocationsService } from './btw-pickup-locations.service';
import { CreateBtwPickupLocationDto } from './dto/create-btw-pickup-location.dto';
import { UpdateBtwPickupLocationDto } from './dto/update-btw-pickup-location.dto';
import { UpdateBtwPickupLocationStatusDto } from './dto/update-btw-pickup-location-status.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('BTW Pickup Locations')
@Controller('btw-pickup-locations')
export class BtwPickupLocationsController {
  constructor(private readonly btwPickupLocationsService: BtwPickupLocationsService) { }

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Crear una nueva ubicación de recogida BTW',
    description: 'Registra un nuevo punto de encuentro para las clases prácticas de manejo.'
  })
  @ApiResponse({ status: 201, description: 'Ubicación de recogida creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 409, description: 'El código de ubicación (btw_pickup_id) ya existe.' })
  @ApiBody({ type: CreateBtwPickupLocationDto })
  create(@Body() createBtwPickupLocationDto: CreateBtwPickupLocationDto) {
    return this.btwPickupLocationsService.create(createBtwPickupLocationDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar todas las ubicaciones',
    description: 'Obtiene el listado completo de los puntos de recogida registrados.'
  })
  @ApiResponse({ status: 200, description: 'Listado obtenido correctamente.' })
  findAll() {
    return this.btwPickupLocationsService.findAll();
  }

  @Public()
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener una ubicación por UUID' })
  @ApiParam({ name: 'uuid', description: 'Identificador único (UUID) de la ubicación' })
  @ApiResponse({ status: 200, description: 'Ubicación encontrada.' })
  @ApiResponse({ status: 404, description: 'Ubicación no encontrada.' })
  findOne(@Param('uuid') uuid: string) {
    return this.btwPickupLocationsService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  @ApiOperation({
    summary: 'Actualizar una ubicación de recogida',
    description: 'Permite modificar el nombre o el ID de una ubicación existente.'
  })
  @ApiParam({ name: 'uuid', description: 'UUID de la ubicación a actualizar' })
  @ApiBody({ type: UpdateBtwPickupLocationDto })
  @ApiResponse({ status: 200, description: 'Ubicación actualizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'No se enviaron datos para actualizar.' })
  @ApiResponse({ status: 404, description: 'Ubicación no encontrada.' })
  @ApiResponse({ status: 409, description: 'El nuevo ID ya está en uso por otra ubicación.' })
  update(@Param('uuid') uuid: string, @Body() updateBtwPickupLocationDto: UpdateBtwPickupLocationDto) {
    return this.btwPickupLocationsService.update(uuid, updateBtwPickupLocationDto);
  }

  @Public()
  @Patch(':uuid/status')
  @ApiOperation({
    summary: 'Cambiar estado de la ubicación',
    description: 'Activa o desactiva un punto de recogida.'
  })
  @ApiParam({ name: 'uuid', description: 'UUID de la ubicación' })
  @ApiBody({ type: UpdateBtwPickupLocationStatusDto })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ubicación no encontrada.' })
  updateStatus(@Param('uuid') uuid: string, @Body() updateStatusDto: UpdateBtwPickupLocationStatusDto) {
    return this.btwPickupLocationsService.updateStatus(uuid, updateStatusDto);
  }
}