import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) { }


  async create(createDto: CreateProductDto) {
    try {

      const newProduct = this.repo.create(createDto);
      console.log('Saving in database: ', newProduct)
      return await this.repo.save(newProduct);

    } catch (error) {
      throw new InternalServerErrorException('Error saving in database')
    }
  }

  async findAll() {
    try {
      console.log('[FIND ALL PRODUCTS] Getting all products...')
      return await this.repo.find()
    } catch (error) {
      console.error('Error fetching products:', error);

      throw new Error('Could not retrieve products');
    }

  }

  async findOne(uuid: string) {
    try {
      console.log(`[FIND ONE PRODUCT] Looking for product with UUID: ${uuid}`);

      const product = await this.repo.findOneBy({ uuid });

      if (!product) {
        throw new Error(`Product with UUID ${uuid} not found`);
      }

      return product

    } catch (error) {
      console.error(`[Error findOne]: ${error.message}`);
      throw new Error('Error getting product')
    }
  }

  async update(uuid: string, product: UpdateProductDto) {
    try {
      console.log(`[UPDATE PRODUCT] Updating product with UUID: ${uuid}`)
      const result = await this.repo.update(uuid, product)

      if (result.affected === 0) {
        console.log(`[UPDATE PRODUCT] Product ${uuid} not found`)
      }

      return { sucess: true, message: 'Product udated succesfully' }
    } catch (error) {
      console.error(`[ERROR UPDATE PRODUCT]: ${error.message}`)
      throw new Error('Error updating product')
    }

  }

  async remove(uuid: string) {
    try {
      console.log(`[DELETE PRODUCT] Deleting product with UUID: ${uuid} `)
      const result = await this.repo.delete(uuid)

      if (result.affected === 0) {
        throw new Error(`[ERROR DELETE PRODUCT] Product with UUID ${uuid} not found`);
      }

      console.log(`Product ${uuid} removed successfully `)

      return { deleted: true, message: `Product ${uuid} removed successfully` };

    } catch (error) {
      console.error(`[ERROR DELETE PRODUCT]: ${error.message}`)
      throw new Error('Error deleting product')
    }
  }
}
