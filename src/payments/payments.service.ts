import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { ChicagoDateHelper } from 'src/common/helpers/date-helper';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>
  ) { }

  async create(dto: CreatePaymentDto) {

    const isMissingData = !dto.thirdParty || dto.thirdParty === null || Object.keys(dto.thirdParty).length === 0

    if (dto.isThirdParty && isMissingData) {
      throw new BadRequestException('If payment comes from a third party person, the payer data must be sent')
    }

    if (!dto.isThirdParty && isMissingData) {
      throw new BadRequestException('Cannot send third party data if isThirdParty is false');
    }

    this.logger.log('Creating new payment...')
    try {
      const payment = this.repo.create(dto)

      const chicagoNow = ChicagoDateHelper.now()
      const chicagoDate = chicagoNow.toISODate()
      const chicagoTime = chicagoNow.toFormat('HH:mm:ss')

      payment.createdDate = chicagoDate
      payment.createdTime = chicagoTime
      payment.updatedDate = chicagoDate
      payment.updatedTime = chicagoTime

      const result = await this.repo.save(payment)
      this.logger.log('Payment created succesfully')
      return result
    } catch (error) {
      this.logger.error('Error creating payment', error.stack)
      throw new InternalServerErrorException('Error creating payment')
    }
  }

  async findAll() {
    this.logger.log('Getting all payments...')
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
    this.logger.log(`Searching for payment with UUID: ${uuid}`);

    const result = await this.repo.findOneBy({ uuid });

    if (!result) {
      this.logger.warn(`Payment with UUID ${uuid} not found`);
      throw new NotFoundException(`Payment with UUID ${uuid} was not found`);
    }

    this.logger.log(`Successfully retrieved payment ${uuid}`);
    return result;
  }

  async update(uuid: string, updateDto: UpdatePaymentDto) {
    const payment = await this.findOne(uuid);

    const willBeThirdParty = updateDto.isThirdParty ?? payment.isThirdParty
    const isMissingData = !updateDto.thirdParty || updateDto.thirdParty === null || Object.keys(updateDto.thirdParty).length === 0

    if (willBeThirdParty && isMissingData) {
      throw new BadRequestException('If payment comes from a third party person, the payer data must be sent');
    }

    if (!willBeThirdParty && updateDto.thirdParty) {
      throw new BadRequestException('Cannot send third party data if isThirdParty is false');
    }

    const previousEmployees = payment.updatedBy || []
    const previousCustomer = payment.customer || {}
    const previousProduct = payment.product || {}
    const previousThirdParty = payment.thirdParty || {}

    this.repo.merge(payment, updateDto);

    //dto valida que siempre venga updatedBy
    const updatedEmployees = [...previousEmployees, ...updateDto.updatedBy]


    if (updateDto.customer) {
      const updatedCustomer = { ...previousCustomer, ...updateDto.customer }
      payment.customer = updatedCustomer
    }

    if (updateDto.thirdParty) {
      const updatedthirdParty = { ...previousThirdParty, ...updateDto.thirdParty }
      payment.thirdParty = updatedthirdParty
    }

    if (updateDto.product) {
      const updatedProduct = { ...previousProduct, ...updateDto.product }
      payment.product = updatedProduct
    }

    payment.updatedBy = updatedEmployees

    const chicagoNow = ChicagoDateHelper.now();
    payment.updatedDate = chicagoNow.toISODate();
    payment.updatedTime = chicagoNow.toFormat('HH:mm:ss');

    this.logger.log(`Updating record with UUID ${uuid}`);

    try {
      return await this.repo.save(payment);
    } catch (error) {
      this.logger.error(`Error updating payment ${uuid}`, error.stack);
      throw new InternalServerErrorException('Could not update payment record');
    }
  }



  async remove(uuid: string) {
    try {

      await this.repo.delete({ uuid });

      this.logger.log(`Payment with UUID ${uuid} was permanently deleted`);
      return { deleted: true, message: `Payment ${uuid} removed` };
    } catch (error) {
      this.logger.error(`Error deleting payment ${uuid}`, error.stack);
      throw new InternalServerErrorException('Could not remove payment record');
    }
  }


}
