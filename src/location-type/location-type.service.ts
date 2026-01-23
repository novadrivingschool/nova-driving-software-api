import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateLocationTypeDto } from './dto/create-location-type.dto';
import { UpdateLocationTypeDto } from './dto/update-location-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChicagoDateHelper } from 'src/common/helpers/date-helper';
import { Repository } from 'typeorm';
import { LocationType } from './entities/location-type.entity';

@Injectable()
export class LocationTypeService {

  private readonly logger = new Logger(LocationTypeService.name);

  constructor(
    @InjectRepository(LocationType)
    private readonly repo: Repository<LocationType>
  ) { }

  async create(dto: CreateLocationTypeDto) {
    try {

      const chicagoNow = ChicagoDateHelper.now()
      const chicagoDate = chicagoNow.toISODate()
      const chicagoTime = chicagoNow.toFormat('HH:mm:ss')

      const data = {
        ...dto,
        created_date: chicagoDate,
        created_time: chicagoTime,
        updated_date: chicagoDate,
        updated_time: chicagoTime

      }

      const result = await this.repo.save(data)
      this.logger.log('[CREATE LOCATION TYPE] Location Type created succesfully')
      return result
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Location Type code already exists');
      }
      this.logger.error('[CREATE LOCATION TYPE] Error creating Location Type', error.stack)
      throw new InternalServerErrorException('Error creating location')
    }
  }


  async findAll() {
    this.logger.log('Getting all location types...')
    try {
      const results = await this.repo.find()
      const resultLength = results.length
      this.logger.log(`Succesfully retrieved ${resultLength} records`)
      return results
    } catch (error) {
      this.logger.log('Error getting records', error.stack)
      throw new InternalServerErrorException('Error getting records')
    }
  }

  async findOne(uuid: string) {
    this.logger.log(`Searching for location type with UUID: ${uuid}`);

    const result = await this.repo.findOneBy({ uuid });

    if (!result) {
      this.logger.warn(`location type with UUID ${uuid} not found`);
      throw new NotFoundException(`location type with UUID ${uuid} was not found`);
    }

    this.logger.log(`Successfully retrieved location type ${uuid}`);
    return result;
  }

  async update(uuid: string, dto: UpdateLocationTypeDto) {

    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    try {
      console.log(`[UPDATE location type] Updating location type with UUID: ${uuid}`)

      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      }

      const result = await this.repo.update(uuid, updateData)

      if (result.affected === 0) {
        console.log(`[UPDATE location type] location type ${uuid} not found`)
      }

      return { sucess: true, message: 'Location type updated succesfully' }
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Location type code already exists');
      }
      console.error(`[ERROR UPDATE location]: ${error.message}`)
      throw new Error('Error updating location')
    }
  }

  async remove(uuid: string) {
    try {
      console.log(`[DELETE LOCATION TYPE] Deleting Location Type with UUID: ${uuid} `)
      const result = await this.repo.delete(uuid)

      if (result.affected === 0) {
        throw new Error(`[ERROR DELETE Location Type] Location Type with UUID ${uuid} not found`);
      }

      console.log(`Location Type ${uuid} removed successfully `)

      return { deleted: true, message: `Location Type ${uuid} removed successfully` };

    } catch (error) {
      console.error(`[ERROR DELETE Location Type]: ${error.message}`)
      throw new Error('Error deleting Location Type')
    }
  }
}
