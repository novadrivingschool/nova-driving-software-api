import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChicagoDateHelper } from 'src/common/helpers/date-helper';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { UpdateLocationStatusDto } from './dto/update-location-status';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    @InjectRepository(Location)
    private readonly repo: Repository<Location>
  ) { }

  async create(dto: CreateLocationDto) {
    try {
      const location = this.repo.create(dto)

      const chicagoNow = ChicagoDateHelper.now()
      const chicagoDate = chicagoNow.toISODate()
      const chicagoTime = chicagoNow.toFormat('HH:mm:ss')

      location.created_date = chicagoDate
      location.created_time = chicagoTime
      location.updated_date = chicagoDate
      location.updated_time = chicagoTime
      location.last_updated_by = dto.created_by

      const result = await this.repo.save(location)
      this.logger.log('Location created succesfully')
      return result
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Location code already exists');
      }
      this.logger.error('Error creating Location', error.stack)
      throw new InternalServerErrorException('Error creating location')
    }
  }


  async findAll() {
    this.logger.log('Getting all locations...')
    try {
      const results = await this.repo.find()

      const cleanData = results.map(location => {
        const { created_time, created_date, updated_date, updated_time, last_updated_by, created_by, ...data } = location
        return data
      })

      const resultLength = results.length

      this.logger.log(`Succesfully retrieved ${resultLength} records`)

      return cleanData
    } catch (error) {
      this.logger.log('Error getting records', error.stack)
      throw new InternalServerErrorException('Error getting records')
    }
  }

  async findOne(uuid: string) {
    this.logger.log(`Searching for location with UUID: ${uuid}`);

    const result = await this.repo.findOneBy({ uuid });

    if (!result) {
      this.logger.warn(`location with UUID ${uuid} not found`);
      throw new NotFoundException(`location with UUID ${uuid} was not found`);
    }

    this.logger.log(`Successfully retrieved location ${uuid}`);
    return result;
  }

  async update(uuid: string, dto: UpdateLocationDto) {

    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    try {
      this.logger.log(`[UPDATE location] Updating location with UUID: ${uuid}`)

      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      }

      const result = await this.repo.update(uuid, updateData)

      if (result.affected === 0) {
        this.logger.log(`[UPDATE location] location ${uuid} not found`)
        throw new NotFoundException(`Location with ${uuid} not found`)
      }

      return { sucess: true, message: 'Location updated succesfully' }
    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      if (error.code === '23505') {
        throw new ConflictException('Location code already exists');
      }

      this.logger.error(`[ERROR UPDATE location]: ${error.message}`)
      throw new Error('Error updating location')
    }
  }

  async updateStatus(uuid: string, dto: UpdateLocationStatusDto) {

    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    try {
      console.log(`[UPDATE STATUS] Updating location with UUID: ${uuid}`)
      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      }

      const result = await this.repo.update(uuid, updateData)

      if (result.affected === 0) {
        this.logger.log(`[UPDATE location] location ${uuid} not found`)
        throw new NotFoundException(`Location with ${uuid} not found`)
      }

      return { sucess: true, message: 'Location status updated succesfully' }

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      this.logger.error(`[ERROR UPDATE location]: ${error.message}`)
      throw new Error('Error updating location')
    }

  }
}
