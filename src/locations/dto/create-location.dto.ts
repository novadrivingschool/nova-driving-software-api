import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from "class-validator";


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
    address: string;

    @ApiProperty({
        description: 'Ciudad donde se encuentra la ubicación',
        example: 'Springfield'
    })
    @IsString()
    city: string;

    @ApiProperty({
        description: 'Estado o provincia',
        example: 'Illinois'
    })
    @IsString()
    state: string;

    @ApiProperty({
        description: 'Código postal',
        example: '62704'
    })
    @IsString()
    zip_code: string;
}