import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateBtwPickupLocationDto {

    @ApiProperty({
        description: 'ID de la ubicación de recogida',
        example: 'BTW-PK-01'
    })
    @IsString()
    btw_pickup_id: string;

    @ApiProperty({
        description: 'Nombre del punto de encuentro',
        example: 'Starbucks on Main St'
    })
    @IsString()
    btw_pickup_name: string;

    @ApiProperty({
        description: 'Estado - TRUE (Activo), FALSE (Inactivo)',
        example: true
    })
    @IsBoolean()
    btw_pickup_status: boolean;

    @ApiProperty({
        description: 'Persona que registró el punto',
        example: 'Mateo Torres'
    })
    @IsString() 
    created_by: string;
}
