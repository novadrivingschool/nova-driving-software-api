import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) { }

  @Public()
  @Post()
  create(@Body() createProductDto: CreatePackageDto) {
    return this.packagesService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.packagesService.findAll();

  }

  @Public()
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.packagesService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() product: UpdatePackageDto) {
    return this.packagesService.update(uuid, product);
  }

  @Public()
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.packagesService.remove(uuid);
  }
}
