import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePackageDto {

    @ApiProperty({
        description: 'Nombre del paquete',
        example: 'BTW Lessons'
    })
    @IsString()
    package_name: string;

    @ApiProperty({
        description: 'Código del paquete. Debe ser único',
        example: 'BTW'
    })
    @IsString()
    package_code: string;

    @ApiProperty({
        description: 'Precio del paquete',
        example: '5.99'
    })
    @IsNumber()
    package_price: number;

    @ApiProperty({
        description: 'Estado del paquete: True-Activo, False-Inactivo',
        example: 'true'
    })
    @IsBoolean()
    package_status: boolean;

    @ApiProperty({
        description: 'Descripción del paquete',
        example: 'Lorem ipsum'
    })
    @IsOptional()
    @IsString()
    package_description: string;

    @ApiProperty({
        description: 'Ubicaciones del paquete ',
        example: 'Fullerton, Aurora'
    })
    @IsArray()
    package_locations: string[];

    @ApiProperty({
        description: 'Nombre del paquete para web',
        example: 'Lorem ipsum'
    })
    @IsOptional()
    @IsString()
    package_web_name: string;

    @ApiProperty({
        description: 'Descripción del paquete para web',
        example: 'Lorem ipsum'
    })
    @IsOptional()
    @IsString()
    package_web_description: string;

    @ApiProperty({
        description: 'Persona que creo el paquete',
        example: 'Mateo Torres'
    })
    @IsString()
    created_by: string;

}
