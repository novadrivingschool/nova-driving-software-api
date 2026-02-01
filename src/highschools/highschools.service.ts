import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateHighschoolDto } from './dto/create-highschool.dto';
import { UpdateHighschoolDto } from './dto/update-highschool.dto';
import { Highschool } from './entities/highschool.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChicagoDateHelper } from 'src/common/helpers/date-helper';
import { UpdateHighschoolStatus } from './dto/update-highschool-status.dto';

@Injectable()
export class HighschoolsService {

  private readonly logger = new Logger(HighschoolsService.name);

  constructor(
    @InjectRepository(Highschool)
    private readonly repo: Repository<Highschool>,
  ) { }


  async create(createDto: CreateHighschoolDto) {
    try {

      const newHighschool = this.repo.create(createDto);

      const chicagoNow = ChicagoDateHelper.now()
      const chicagoDate = chicagoNow.toISODate()
      const chicagoTime = chicagoNow.toFormat('HH:mm:ss')

      newHighschool.created_date = chicagoDate
      newHighschool.created_time = chicagoTime
      newHighschool.updated_date = chicagoDate
      newHighschool.updated_time = chicagoTime
      newHighschool.last_updated_by = createDto.created_by

      console.log('Saving in database: ', newHighschool)
      return await this.repo.save(newHighschool);

    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Highschool code already exists');
      }
      this.logger.error('Error creating highschool', error.stack)
      throw new InternalServerErrorException('Error creating highschool')
    }
  }

  async findAll() {
    try {
      this.logger.log('[FIND ALL HIGHSCHOOLS] Getting all highschools...')
      const results = await this.repo.find()

      const cleanData = results.map(item => {
        const { created_time, created_date, updated_date, updated_time, last_updated_by, created_by, ...data } = item
        return data
      })

      const resultLength = results.length

      this.logger.log(`Succesfully retrieved ${resultLength} records`)

      return cleanData
    } catch (error) {
      this.logger.error('Error fetching highschools:', error);

      throw new Error('Could not retrieve highschools');
    }

  }


  async findOne(uuid: string) {
    try {
      this.logger.log(`[FIND ONE HIGHSCHOOL] Looking for product with UUID: ${uuid}`);

      const product = await this.repo.findOneBy({ uuid });

      if (!product) {
        throw new NotFoundException(`Highschool with UUID ${uuid} not found`);
      }

      return product

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      this.logger.error(`[Error findOne]: ${error.message}`);
      throw new Error('Error getting highschool')
    }
  }

  async update(uuid: string, dto: UpdateHighschoolDto) {

    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    try {
      console.log(`[UPDATE HIGHSCHOOL] Updating highschool with UUID: ${uuid}`)
      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      }

      const result = await this.repo.update(uuid, updateData)

      if (result.affected === 0) {
        throw new NotFoundException(`highschool with UUID ${uuid} not found`);
      }


      return { sucess: true, message: 'Highschool updated succesfully' }
    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      if (error.code === '23505') {
        throw new ConflictException('highschool code already exists');
      }

      this.logger.error('Error creating highschool', error.stack)
      throw new InternalServerErrorException('Error creating highschool')
    }

  }

  async updateStatus(uuid: string, dto: UpdateHighschoolStatus) {

    try {
      console.log(`[UPDATE HIGHSCHOOL STATUS] Updating Highschool with UUID: ${uuid}`)
      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      }

      const result = await this.repo.update(uuid, updateData);

      if (result.affected === 0) {
        throw new NotFoundException(`Highschool with UUID ${uuid} not found`);
      }

      return { sucess: true, message: 'Highschool status updated succesfully' }

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      this.logger.error(`${error.message}`)
      throw new Error('Error updating location')
    }

  }
}
