import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePackageDto {

    @ApiProperty({
        description: 'Nombre de producto',
        example: 'Producto'
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Precio del producto',
        example: '5.99'
    })
    @IsNumber()
    price: number;

    @ApiProperty({
        description: 'Descripción de producto',
        example: 'Lorem ipsum'
    })
    @IsOptional()
    @IsString()
    description: string;
}
