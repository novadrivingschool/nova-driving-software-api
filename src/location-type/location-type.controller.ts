import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationTypeService } from './location-type.service';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';
import { UpdateLocationTypeDto } from './dto/update-location-type.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('location-type')
export class LocationTypeController {
  constructor(private readonly locationTypeService: LocationTypeService) { }

  @Public()
  @Post()
  create(@Body() createLocationTypeDto: CreateLocationTypeDto) {
    return this.locationTypeService.create(createLocationTypeDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.locationTypeService.findAll();
  }

  @Public()
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
  return this.locationTypeService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateLocationTypeDto: UpdateLocationTypeDto) {
    return this.locationTypeService.update(uuid, updateLocationTypeDto);
  }

  @Public()
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.locationTypeService.remove(uuid);
  }
}
