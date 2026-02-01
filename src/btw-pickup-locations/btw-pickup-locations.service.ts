import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChicagoDateHelper } from 'src/common/helpers/date-helper';

import { CreateBtwPickupLocationDto } from './dto/create-btw-pickup-location.dto';
import { UpdateBtwPickupLocationDto } from './dto/update-btw-pickup-location.dto';
import { UpdateBtwPickupLocationStatusDto } from './dto/update-btw-pickup-location-status.dto';
import { BtwPickupLocation } from './entities/btw-pickup-location.entity';

@Injectable()
export class BtwPickupLocationsService {

  private readonly logger = new Logger(BtwPickupLocationsService.name);

  constructor(
    @InjectRepository(BtwPickupLocation)
    private readonly repo: Repository<BtwPickupLocation>,
  ) { }

  async create(createDto: CreateBtwPickupLocationDto) {
    try {
      const newBtwLocation = this.repo.create(createDto);

      const chicagoNow = ChicagoDateHelper.now();
      const chicagoDate = chicagoNow.toISODate();
      const chicagoTime = chicagoNow.toFormat('HH:mm:ss');

      // Auditoría con nombres específicos
      newBtwLocation.created_date = chicagoDate;
      newBtwLocation.created_time = chicagoTime;
      newBtwLocation.updated_date = chicagoDate;
      newBtwLocation.updated_time = chicagoTime;
      newBtwLocation.last_updated_by = createDto.created_by;

      this.logger.log(`Saving new BTW pickup location: ${createDto.btw_pickup_name}`);
      return await this.repo.save(newBtwLocation);

    } catch (error) {
      // Manejo de duplicados para btw_pickup_id
      if (error.code === '23505') {
        throw new ConflictException('BTW pickup location code already exists');
      }
      this.logger.error('Error creating BTW pickup location', error.stack);
      throw new InternalServerErrorException('Error creating BTW pickup location');
    }
  }

  async findAll() {
    try {
      this.logger.log('[FIND ALL BTW LOCATIONS] Getting all records...');
      const results = await this.repo.find();

      // Limpieza de datos de auditoría para la respuesta pública
      const cleanData = results.map(item => {
        const { created_time, created_date, updated_date, updated_time, last_updated_by, created_by, ...data } = item;
        return data;
      });

      this.logger.log(`Successfully retrieved ${results.length} BTW records`);
      return cleanData;
    } catch (error) {
      this.logger.error('Error fetching BTW pickup locations:', error);
      throw new InternalServerErrorException('Could not retrieve BTW pickup locations');
    }
  }

  async findOne(uuid: string) {
    try {
      this.logger.log(`[FIND ONE BTW LOCATION] Looking for UUID: ${uuid}`);

      const record = await this.repo.findOneBy({ uuid });

      if (!record) {
        throw new NotFoundException(`BTW pickup location with UUID ${uuid} not found`);
      }

      return record;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`[Error findOne]: ${error.message}`);
      throw new InternalServerErrorException('Error getting BTW pickup location');
    }
  }

  async update(uuid: string, dto: UpdateBtwPickupLocationDto) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    try {
      this.logger.log(`[UPDATE BTW LOCATION] Updating UUID: ${uuid}`);
      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      };

      const result = await this.repo.update(uuid, updateData);

      if (result.affected === 0) {
        throw new NotFoundException(`BTW pickup location with UUID ${uuid} not found`);
      }

      return { success: true, message: 'BTW pickup location updated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.code === '23505') {
        throw new ConflictException('BTW pickup location code already exists');
      }

      this.logger.error('Error updating BTW pickup location', error.stack);
      throw new InternalServerErrorException('Error updating BTW pickup location');
    }
  }

  async updateStatus(uuid: string, dto: UpdateBtwPickupLocationStatusDto) {
    try {
      this.logger.log(`[UPDATE BTW STATUS] Updating UUID: ${uuid}`);
      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      };

      const result = await this.repo.update(uuid, updateData);

      if (result.affected === 0) {
        throw new NotFoundException(`BTW pickup location with UUID ${uuid} not found`);
      }

      return { success: true, message: 'BTW status updated successfully' };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error updating status: ${error.message}`);
      throw new InternalServerErrorException('Error updating BTW pickup location status');
    }
  }
}