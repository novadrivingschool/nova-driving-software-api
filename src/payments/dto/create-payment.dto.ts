import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsArray, IsBoolean, IsDate, IsEmail, IsISO8601,
    IsNumber, IsObject, IsOptional, IsString, ValidateNested
} from "class-validator";

export class PayerDto {
    @ApiProperty({ example: 'Michael', description: 'Nombre de la persona que realiza el pago' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Jordan', description: 'Apellido de la persona que realiza el pago' })
    @IsString()
    lastname: string;

    @ApiProperty({ example: 'm.jordan@correo.com', description: 'Correo electrónico' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '1901 W Madison St', description: 'Dirección' })
    @IsString()
    address: string;

    @ApiProperty({ example: '1963-02-17T00:00:00.000Z', type: Date, description: 'Fecha de nacimiento' })
    @IsDate()
    @Type(() => Date)
    birthdate: Date;

    @ApiProperty({ example: 'West Side, Chicago', description: 'Ubicación o barrio' })
    @IsString()
    location: string;

    @ApiProperty({ example: '+1 312 555 0123', description: 'Teléfono' })
    @IsString()
    phone: string;
}

export class ProductDto {
    @ApiProperty({ example: 'Road test', description: 'Nombre del producto' })
    @IsString()
    name: string;

    @ApiProperty({ example: 35.50, description: 'Precio en USD' })
    @IsNumber()
    price: number;

    @ApiProperty({ example: 'Lorem ipsum', description: 'Descripción detallada' })
    @IsString()
    description: string;
}


export class CreatePaymentDto {
    @ApiProperty({ type: () => PayerDto, description: 'Datos del cliente principal' })
    @IsObject()
    @ValidateNested()
    @Type(() => PayerDto)
    customer: PayerDto;

    @ApiProperty({ type: () => ProductDto, description: 'Datos del producto adquirido' })
    @IsObject()
    @ValidateNested()
    @Type(() => ProductDto)
    product: ProductDto;

    @ApiProperty({ example: false, description: '¿El pago es realizado por un tercero?' })
    @IsBoolean()
    isThirdParty: boolean;

    @ApiProperty({ type: () => PayerDto, required: false, description: 'Datos del tercero (opcional)' })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PayerDto)
    thirdParty?: PayerDto;

    @ApiProperty({ example: 35.50, description: 'Total del pago en USD' })
    @IsNumber()
    paymentTotal: number;

    @ApiProperty({ example: 'chicago_admin', description: 'Usuario que generó el registro' })
    @IsString()
    createdBy: string;


    
}