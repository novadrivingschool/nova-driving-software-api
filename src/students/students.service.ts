import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChicagoDateHelper } from 'src/common/helpers/date-helper';

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {

  private readonly logger = new Logger(StudentsService.name);

  constructor(
    @InjectRepository(Student)
    private readonly repo: Repository<Student>,
  ) { }


  async create(createDto: CreateStudentDto) {
    try {

      const newStudent = this.repo.create(createDto);

      const chicagoNow = ChicagoDateHelper.now()
      const chicagoDate = chicagoNow.toISODate()
      const chicagoTime = chicagoNow.toFormat('HH:mm:ss')

      newStudent.created_date = chicagoDate
      newStudent.created_time = chicagoTime
      newStudent.updated_date = chicagoDate
      newStudent.updated_time = chicagoTime
      newStudent.last_updated_by = createDto.created_by

      console.log('Saving in database: ', newStudent)
      return await this.repo.save(newStudent);

    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Student already exists (Duplicate key)');
      }
      this.logger.error('Error creating student', error.stack)
      throw new InternalServerErrorException('Error creating student')
    }
  }

  async findAll() {
    try {
      this.logger.log('[FIND ALL STUDENTS] Getting all students...')
      const results = await this.repo.find()

      const cleanData = results.map(item => {
        const { created_time, created_date, updated_date, updated_time, last_updated_by, created_by, ...data } = item
        return data
      })

      const resultLength = results.length

      this.logger.log(`Succesfully retrieved ${resultLength} records`)

      return cleanData
    } catch (error) {
      this.logger.error('Error fetching students:', error);

      throw new Error('Could not retrieve students');
    }

  }


  async findOne(uuid: string) {
    try {
      this.logger.log(`[FIND ONE STUDENT] Looking for student with UUID: ${uuid}`);

      const student = await this.repo.findOneBy({ uuid });

      if (!student) {
        throw new NotFoundException(`Student with UUID ${uuid} not found`);
      }

      return student

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      this.logger.error(`[Error findOne]: ${error.message}`);
      throw new Error('Error getting student')
    }
  }

  async update(uuid: string, dto: UpdateStudentDto) {

    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided for update');
    }

    try {
      console.log(`[UPDATE STUDENT] Updating student with UUID: ${uuid}`)
      const chicagoNow = ChicagoDateHelper.now();

      const updateData = {
        ...dto,
        updated_date: chicagoNow.toISODate(),
        updated_time: chicagoNow.toFormat('HH:mm:ss')
      }

      const result = await this.repo.update(uuid, updateData)

      if (result.affected === 0) {
        throw new NotFoundException(`Student with UUID ${uuid} not found`);
      }

      return { success: true, message: 'Student updated succesfully' }

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      if (error.code === '23505') {
        throw new ConflictException('Student data already exists');
      }

      this.logger.error('Error updating student', error.stack)
      throw new InternalServerErrorException('Error updating student')
    }

  }

  async remove(uuid: string) {

    await this.findOne(uuid)

    try {
      console.log(`[DELETE STUDENT] Deleting student with UUID: ${uuid} `)

      const result = await this.repo.delete(uuid)

      if (result.affected === 0) {
        throw new NotFoundException(`Student with UUID ${uuid} not found`);
      }

      console.log(`Student ${uuid} removed successfully `)

      return { success: true, message: `Student removed successfully` };

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      this.logger.error(`[ERROR DELETE STUDENT]: ${error.message}`)
      throw new InternalServerErrorException('Error deleting student')
    }
  }

}