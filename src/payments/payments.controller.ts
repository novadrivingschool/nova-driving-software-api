import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Payments') 
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Registrar un nuevo pago',
    description: 'Crea un registro de pago.'
  })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Pago registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (Ej: Falta información del tercero o se envía información de tercero cuando no corresponde).' })
  @ApiResponse({ status: 500, description: 'Error interno al crear el pago.' })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar todos los pagos',
    description: 'Obtiene el historial completo de pagos registrados en el sistema.'
  })
  @ApiResponse({ status: 200, description: 'Listado de pagos obtenido correctamente.' })
  @ApiResponse({ status: 500, description: 'Error al obtener los registros.' })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Public()
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener un pago por UUID' })
  @ApiParam({ name: 'uuid', description: 'Identificador único (UUID) del pago' })
  @ApiResponse({ status: 200, description: 'Pago encontrado.' })
  @ApiResponse({ status: 404, description: 'No se encontró el pago con el UUID proporcionado.' })
  findOne(@Param('uuid') uuid: string) {
    return this.paymentsService.findOne(uuid);
  }

  @Public()
  @Patch(':uuid')
  @ApiOperation({
    summary: 'Actualizar un pago',
    description: 'Actualiza la información de un pago existente'
  })
  @ApiParam({ name: 'uuid', description: 'UUID del pago a actualizar' })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({ status: 200, description: 'Pago actualizado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (Inconsistencia en datos de terceros).' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno al actualizar el pago.' })
  update(@Param('uuid') uuid: string, @Body() updateDto: UpdatePaymentDto) {
    return this.paymentsService.update(uuid, updateDto);
  }

  @Public()
  @Delete(':uuid')
  @ApiOperation({
    summary: 'Eliminar un pago',
    description: 'Elimina permanentemente un registro de pago de la base de datos.'
  })
  @ApiParam({ name: 'uuid', description: 'UUID del pago a eliminar' })
  @ApiResponse({ status: 200, description: 'Pago eliminado exitosamente.' })
  @ApiResponse({ status: 500, description: 'Error interno al eliminar el pago.' })
  remove(@Param('uuid') uuid: string) {
    return this.paymentsService.remove(uuid);
  }
}