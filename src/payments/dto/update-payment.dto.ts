import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto, PayerDto, ProductDto } from './create-payment.dto';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';


export class EmployeeDto {
    @ApiProperty({ example: 'Jane Addams', description: 'Nombre completo del empleado' })
    @IsString()
    fullName: string;

    @ApiProperty({ example: 'NOVA000006', description: 'Número de empleado' })
    @IsString()
    employeeNumber: string;
}


export class UpdatePayerDto extends PartialType(PayerDto) { }
export class UpdateProductDto extends PartialType(ProductDto) { }
export class UpdatePaymentDto extends PartialType(
    OmitType(CreatePaymentDto, ['customer', 'product', 'thirdParty'] as const),
) {

    @IsOptional()
    @ValidateNested()
    @Type(() => UpdatePayerDto)
    customer?: UpdatePayerDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => UpdatePayerDto)
    thirdParty?: UpdatePayerDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateProductDto)
    product?: UpdateProductDto;

    @ApiProperty({ type: () => EmployeeDto, isArray: true, description: 'Lista de empleados que actualizaron el registro' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EmployeeDto)
    updatedBy: EmployeeDto[];

}
