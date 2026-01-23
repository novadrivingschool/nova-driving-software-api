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
    summary: 'Crear un nuevo tipo de ubicación'
  })
  @ApiResponse({ status: 201, description: 'Location Type created succesfully' })
  @ApiResponse({ status: 409, description: 'Location Type code already exists' })
  @ApiResponse({ status: 500, description: 'Error creating location' })
  create(@Body() createLocationTypeDto: CreateLocationTypeDto) {
    return this.locationTypeService.create(createLocationTypeDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de ubicación'
  })
  @ApiResponse({ status: 200, description: 'Succesfully retrieved records' })
  @ApiResponse({ status: 500, description: 'Error getting records' })
  findAll() {
    return this.locationTypeService.findAll();
  }

  @Public()
  @Get(':uuid')
  @ApiOperation({
    summary: 'Buscar por UUID'
  })
  @ApiParam({ name: 'uuid', description: 'UUID del registro' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved location type' })
  @ApiResponse({ status: 404, description: 'Location type was not found' })
  findOne(@Param('uuid') uuid: string) {
    return this.locationTypeService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  @ApiOperation({
    summary: 'Actualizar tipo de ubicación'
  })
  @ApiBody({ type: UpdateLocationTypeDto })
  @ApiResponse({ status: 200, description: 'Location type updated succesfully' })
  @ApiResponse({ status: 400, description: 'No data provided for update' })
  @ApiResponse({ status: 409, description: 'Location type code already exists' })
  @ApiResponse({ status: 500, description: 'Error updating location' })
  update(@Param('uuid') uuid: string, @Body() updateLocationTypeDto: UpdateLocationTypeDto) {
    return this.locationTypeService.update(uuid, updateLocationTypeDto);
  }

  @Public()
  @Delete(':uuid')
  @ApiOperation({
    summary: 'Eliminar tipo de ubicación'
  })
  @ApiResponse({ status: 200, description: 'Location Type removed successfully' })
  @ApiResponse({ status: 404, description: 'Location Type not found' })
  @ApiResponse({ status: 500, description: 'Error deleting Location Type' })
  remove(@Param('uuid') uuid: string) {
    return this.locationTypeService.remove(uuid);
  }
}
