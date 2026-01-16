import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.productsService.findAll();

  }

  @Public()
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.productsService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() product: UpdateProductDto) {
    return this.productsService.update(uuid, product);
  }

  @Public()
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.productsService.remove(uuid);
  }
}
