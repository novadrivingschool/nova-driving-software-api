import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { ChicagoDateHelper } from 'src/common/helpers/date-helper';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';

@Injectable()
export class PackagesService {

  private readonly logger = new Logger(PackagesService.name);

  constructor(
    @InjectRepository(Package)
    private readonly repo: Repository<Package>,
  ) { }


  async create(createDto: CreatePackageDto) {
    try {

      const newPackage = this.repo.create(createDto);

      const chicagoNow = ChicagoDateHelper.now()
      const chicagoDate = chicagoNow.toISODate()
      const chicagoTime = chicagoNow.toFormat('HH:mm:ss')

      newPackage.created_date = chicagoDate
      newPackage.created_time = chicagoTime
      newPackage.updated_date = chicagoDate
      newPackage.updated_time = chicagoTime
      newPackage.last_updated_by = createDto.created_by

      console.log('Saving in database: ', newPackage)
      return await this.repo.save(newPackage);

    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Package code already exists');
      }
      this.logger.error('Error creating package', error.stack)
      throw new InternalServerErrorException('Error creating package')
    }
  }

  async findAll() {
    try {
      this.logger.log('[FIND ALL PACKAGES] Getting all packages...')
      const results = await this.repo.find()

      const cleanData = results.map(item => {
        const { created_time, created_date, updated_date, updated_time, last_updated_by, created_by, ...data } = item
        return data
      })

      const resultLength = results.length

      this.logger.log(`Succesfully retrieved ${resultLength} records`)

      return cleanData
    } catch (error) {
      this.logger.error('Error fetching products:', error);

      throw new Error('Could not retrieve products');
    }

  }

  async findOne(uuid: string) {
    try {
      this.logger.log(`[FIND ONE PACKAGE] Looking for product with UUID: ${uuid}`);

      const product = await this.repo.findOneBy({ uuid });

      if (!product) {
        throw new NotFoundException(`Package with UUID ${uuid} not found`);
      }

      return product

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      this.logger.error(`[Error findOne]: ${error.message}`);
      throw new Error('Error getting package')
    }
  }

  async update(uuid: string, dto: UpdatePackageDto) {

    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    try {
      console.log(`[UPDATE PACKAGE] Updating package with UUID: ${uuid}`)
      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      }

      const result = await this.repo.update(uuid, updateData)

      if (result.affected === 0) {
        throw new NotFoundException(`Package with UUID ${uuid} not found`);
      }


      return { sucess: true, message: 'Package updated succesfully' }
    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      if (error.code === '23505') {
        throw new ConflictException('Package code already exists');
      }

      this.logger.error('Error creating package', error.stack)
      throw new InternalServerErrorException('Error creating package')
    }

  }

  // async remove(uuid: string) {

  //   await this.findOne(uuid)


  //   try {
  //     console.log(`[DELETE PRODUCT] Deleting product with UUID: ${uuid} `)
  //     await this.repo.delete(uuid)

  //     console.log(`Product ${uuid} removed successfully `)

  //     return { deleted: true, message: `Product ${uuid} removed successfully` };

  //   } catch (error) {
  //     console.error(`[ERROR DELETE PRODUCT]: ${error.message}`)
  //     throw new Error('Error deleting product')
  //   }
  // }

  async updateStatus(uuid: string, dto: UpdatePackageStatusDto) {

    try {
      console.log(`[UPDATE PACKAGE STATUS] Updating package with UUID: ${uuid}`)
      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      }

      const result = await this.repo.update(uuid, updateData);

      if (result.affected === 0) {
        throw new NotFoundException(`Package with UUID ${uuid} not found`);
      }

      return { sucess: true, message: 'Package status updated succesfully' }

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      this.logger.error(`${error.message}`)
      throw new Error('Error updating location')
    }

  }
}
