import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Public()
  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Public()
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Public()
  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.paymentsService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateDto: UpdatePaymentDto) {
    return this.paymentsService.update(uuid, updateDto);
  }

  @Public()
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.paymentsService.remove(uuid);
  }
}
