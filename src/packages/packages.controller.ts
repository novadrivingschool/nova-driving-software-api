import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Packages') 
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) { }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo paquete', description: 'Crea un paquete de manejo con sus ubicaciones y precios.' })
  @ApiResponse({ status: 201, description: 'Paquete creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (Bad Request).' })
  @ApiResponse({ status: 409, description: 'El código del paquete ya existe.' })
  @ApiBody({ type: CreatePackageDto })
  create(@Body() createProductDto: CreatePackageDto) {
    return this.packagesService.create(createProductDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener todos los paquetes', description: 'Devuelve una lista de todos los paquetes registrados.' })
  @ApiResponse({ status: 200, description: 'Lista recuperada exitosamente.' })
  findAll() {
    return this.packagesService.findAll();
  }

  @Public()
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener un paquete por UUID', description: 'Busca y devuelve un paquete específico.' })
  @ApiParam({ name: 'uuid', description: 'Identificador único (UUID) del paquete', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Paquete encontrado.' })
  @ApiResponse({ status: 404, description: 'Paquete no encontrado.' })
  findOne(@Param('uuid') uuid: string) {
    return this.packagesService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  @ApiOperation({ summary: 'Actualizar un paquete', description: 'Actualiza los datos generales de un paquete existente.' })
  @ApiParam({ name: 'uuid', description: 'UUID del paquete a actualizar' })
  @ApiResponse({ status: 200, description: 'Paquete actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Paquete no encontrado.' })
  @ApiResponse({ status: 409, description: 'Conflicto: El código del paquete ya está en uso.' })
  @ApiBody({ type: UpdatePackageDto })
  update(@Param('uuid') uuid: string, @Body() product: UpdatePackageDto) {
    return this.packagesService.update(uuid, product);
  }

  // @Public()
  // @Delete(':uuid')
  // remove(@Param('uuid') uuid: string) {
  //   return this.packagesService.remove(uuid);
  // }

  @Public()
  @Patch(':uuid/status')
  @ApiOperation({ summary: 'Cambiar estado del paquete', description: 'Activa o desactiva un paquete (Soft Delete/Enable).' })
  @ApiParam({ name: 'uuid', description: 'UUID del paquete' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Paquete no encontrado.' })
  @ApiBody({ type: UpdatePackageStatusDto })
  updateStatus(@Param('uuid') uuid: string, @Body() packageDto: UpdatePackageStatusDto) {
    return this.packagesService.updateStatus(uuid, packageDto)
  }
}