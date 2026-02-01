import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { LeadSourcesService } from './lead-sources.service';
import { CreateLeadSourceDto } from './dto/create-lead-source.dto';
import { UpdateLeadSourceDto } from './dto/update-lead-source.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateLeadSourceStatusDto } from './dto/update-lead-source-status.dto';
import { ApiOperation, ApiParam, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Lead Sources')
@Controller('lead-sources')
export class LeadSourcesController {
  constructor(private readonly leadSourcesService: LeadSourcesService) { }

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Crear una nueva fuente de origen',
    description: 'Registra una nueva opción para la pregunta "¿Cómo se enteró de nosotros?".'
  })
  @ApiResponse({ status: 201, description: 'Fuente de origen creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 409, description: 'El ID de la fuente (source_id) ya existe.' })
  create(@Body() createLeadSourceDto: CreateLeadSourceDto) {
    return this.leadSourcesService.create(createLeadSourceDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar todas las fuentes',
    description: 'Obtiene el listado completo de fuentes de origen (Facebook, Google, etc.).'
  })
  @ApiResponse({ status: 200, description: 'Listado obtenido correctamente.' })
  findAll() {
    return this.leadSourcesService.findAll();
  }

  @Public()
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener una fuente por su UUID' })
  @ApiParam({ name: 'uuid', description: 'Identificador único (UUID) de la fuente en la base de datos' })
  @ApiResponse({ status: 200, description: 'Fuente encontrada.' })
  @ApiResponse({ status: 404, description: 'No se encontró la fuente de origen.' })
  findOne(@Param('uuid') uuid: string) {
    return this.leadSourcesService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  @ApiOperation({
    summary: 'Actualizar una fuente de origen',
    description: 'Permite modificar el nombre o el ID de una fuente existente.'
  })
  @ApiParam({ name: 'uuid', description: 'UUID de la fuente a actualizar' })
  @ApiBody({ type: UpdateLeadSourceDto })
  @ApiResponse({ status: 200, description: 'Fuente actualizada correctamente.' })
  @ApiResponse({ status: 404, description: 'La fuente a actualizar no existe.' })
  @ApiResponse({ status: 409, description: 'El nuevo source_id ya está en uso por otra fuente.' })
  update(@Param('uuid') uuid: string, @Body() updateLeadSourceDto: UpdateLeadSourceDto) {
    return this.leadSourcesService.update(uuid, updateLeadSourceDto);
  }

  @Public()
  @Patch(':uuid/status')
  @ApiOperation({
    summary: 'Cambiar estado de la fuente',
    description: 'Activa o desactiva una fuente de origen para que aparezca o no en los formularios.'
  })
  @ApiParam({ name: 'uuid', description: 'UUID de la fuente de origen' })
  @ApiBody({ type: UpdateLeadSourceStatusDto })
  @ApiResponse({ status: 200, description: 'Estado de la fuente actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Fuente no encontrada.' })
  updateStatus(@Param('uuid') uuid: string, @Body() updateStatusDto: UpdateLeadSourceStatusDto) {
    return this.leadSourcesService.updateStatus(uuid, updateStatusDto)
  }
}