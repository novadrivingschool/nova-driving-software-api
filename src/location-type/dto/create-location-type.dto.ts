import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationTypeDto {
    @ApiProperty({
        description: 'Identificador único del tipo de ubicación (UUID o Código)',
        example: 'TYP-001',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({
        description: 'Nombre descriptivo del tipo de ubicación',
        example: 'Warehouse',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    type_name: string;
}