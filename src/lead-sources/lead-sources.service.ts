import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChicagoDateHelper } from 'src/common/helpers/date-helper';

// Importa tus nuevos DTOs y Entity
import { CreateLeadSourceDto } from './dto/create-lead-source.dto';
import { UpdateLeadSourceDto } from './dto/update-lead-source.dto';
import { UpdateLeadSourceStatusDto } from './dto/update-lead-source-status.dto';
import { LeadSource } from './entities/lead-source.entity';

@Injectable()
export class LeadSourcesService {

  private readonly logger = new Logger(LeadSourcesService.name);

  constructor(
    @InjectRepository(LeadSource)
    private readonly repo: Repository<LeadSource>,
  ) { }

  async create(createDto: CreateLeadSourceDto) {
    try {
      const newLeadSource = this.repo.create(createDto);

      const chicagoNow = ChicagoDateHelper.now();
      const chicagoDate = chicagoNow.toISODate();
      const chicagoTime = chicagoNow.toFormat('HH:mm:ss');

      // Auditoría
      newLeadSource.created_date = chicagoDate;
      newLeadSource.created_time = chicagoTime;
      newLeadSource.updated_date = chicagoDate;
      newLeadSource.updated_time = chicagoTime;
      newLeadSource.last_updated_by = createDto.created_by;

      this.logger.log(`Saving new lead source: ${createDto.source_name}`);
      return await this.repo.save(newLeadSource);

    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Lead source code already exists');
      }
      this.logger.error('Error creating lead source', error.stack);
      throw new InternalServerErrorException('Error creating lead source');
    }
  }

  async findAll() {
    try {
      this.logger.log('[FIND ALL LEAD SOURCES] Getting all records...');
      const results = await this.repo.find();

      // Limpieza de datos sensibles/auditoría para la respuesta
      const cleanData = results.map(item => {
        const { created_time, created_date, updated_date, updated_time, last_updated_by, created_by, ...data } = item;
        return data;
      });

      this.logger.log(`Successfully retrieved ${results.length} records`);
      return cleanData;
    } catch (error) {
      this.logger.error('Error fetching lead sources:', error);
      throw new InternalServerErrorException('Could not retrieve lead sources');
    }
  }

  async findOne(uuid: string) {
    try {
      this.logger.log(`[FIND ONE LEAD SOURCE] Looking for UUID: ${uuid}`);

      const record = await this.repo.findOneBy({ uuid });

      if (!record) {
        throw new NotFoundException(`Lead source with UUID ${uuid} not found`);
      }

      return record;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`[Error findOne]: ${error.message}`);
      throw new InternalServerErrorException('Error getting lead source');
    }
  }

  async update(uuid: string, dto: UpdateLeadSourceDto) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    try {
      this.logger.log(`[UPDATE LEAD SOURCE] Updating UUID: ${uuid}`);
      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      };

      const result = await this.repo.update(uuid, updateData);

      if (result.affected === 0) {
        throw new NotFoundException(`Lead source with UUID ${uuid} not found`);
      }

      return { success: true, message: 'Lead source updated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.code === '23505') {
        throw new ConflictException('Lead source code already exists');
      }

      this.logger.error('Error updating lead source', error.stack);
      throw new InternalServerErrorException('Error updating lead source');
    }
  }

  async updateStatus(uuid: string, dto: UpdateLeadSourceStatusDto) {
    try {
      this.logger.log(`[UPDATE LEAD SOURCE STATUS] Updating UUID: ${uuid}`);
      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      };

      const result = await this.repo.update(uuid, updateData);

      if (result.affected === 0) {
        throw new NotFoundException(`Lead source with UUID ${uuid} not found`);
      }

      return { success: true, message: 'Lead source status updated successfully' };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error updating status: ${error.message}`);
      throw new InternalServerErrorException('Error updating lead source status');
    }
  }
}