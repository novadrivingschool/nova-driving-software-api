import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateLocationStatusDto } from './dto/update-location-status';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) { }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new location', description: 'Register a new location. Location code duplications are not allowed' })
  @ApiResponse({ status: 201, description: 'The location has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data sent.' })
  @ApiResponse({ status: 409, description: 'Location code already exists.' })

  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all locations', description: 'List of all the registered locations' })
  @ApiResponse({ status: 200, description: 'Return all locations.' })

  findAll() {
    return this.locationsService.findAll();
  }

  @Public()
  @Get(':uuid')
  @ApiOperation({ summary: 'Get a location by UUID', description: 'Get a location by UUID.' })
  @ApiParam({ name: 'uuid', description: 'Unique identifier of the location', example: 'e0f08372-1451-4e36-a416-50895f085c25' })
  @ApiResponse({ status: 200, description: 'Location found.' })
  @ApiResponse({ status: 404, description: 'Location not found.' })

  findOne(@Param('uuid') uuid: string) {
    return this.locationsService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a location', description: 'Register a new location. Location code duplications are not allowed' })
  @ApiParam({ name: 'uuid', description: 'UUID of the location to update' })
  @ApiBody({ type: UpdateLocationDto })
  @ApiResponse({ status: 200, description: 'Location updated successfully.' })
  @ApiResponse({ status: 404, description: 'Location not found.' })
  @ApiResponse({ status: 409, description: 'Location code already exists.' })

  update(@Param('uuid') uuid: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(uuid, updateLocationDto);
  }


  @Public()
  @Patch(':uuid/status')
  @ApiOperation({ summary: 'Update location status', description: 'Update status of a location' })
  @ApiParam({ name: 'uuid', description: 'UUID of the location to update' })
  @ApiBody({ type: UpdateLocationStatusDto })
  @ApiResponse({ status: 200, description: 'Location status updated successfully.' })
  @ApiResponse({ status: 404, description: 'Location not found.' })

  updateStatus(@Param('uuid') uuid: string, @Body() updateLocationStatusDto: UpdateLocationStatusDto) {
    return this.locationsService.updateStatus(uuid, updateLocationStatusDto)
  }
}
