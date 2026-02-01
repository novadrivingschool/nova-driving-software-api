import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from "class-validator";


export enum LocationStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
    PENDING = 'Pending',
    DELETED = 'Deleted'
}

export class CreateLocationDto {
    @ApiProperty({
        description: 'Nombre de la ubicación o sucursal',
        example: 'Main Downtown Office'
    })
    @IsString()
    location_name: string;

    @ApiProperty({
        description: 'Código único identificador de la ubicación',
        example: 'LOC-001'
    })
    @IsString()
    location_code: string;

    @ApiProperty({
        description: 'Estado actual de la ubicación',
        enum: LocationStatus,
        example: LocationStatus.ACTIVE
    })
    @IsEnum(LocationStatus)
    location_status: LocationStatus;

    @ApiProperty({
        description: 'Tipo de establecimiento',
        example: 'Branch'
    })
    @IsString()
    location_type: string;

    @ApiProperty({
        description: 'Dirección física de la ubicación',
        example: '742 Evergreen Terrace'
    })
    @IsString()
    location_address: string;

    @ApiProperty({
        description: 'Ciudad donde se encuentra la ubicación',
        example: 'Springfield'
    })
    @IsString()
    location_city: string;

    @ApiProperty({
        description: 'Estado o provincia',
        example: 'Illinois'
    })
    @IsString()
    location_state: string;

    @ApiProperty({
        description: 'Código postal',
        example: '62704'
    })
    @IsString()
    location_zip_code: string;

    @ApiProperty({
        description: 'Persona que creo la ubicación',
        example: 'Mateo Torres'
    })
    @IsString()
    created_by: string;
}