import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator";


export class UpdateBtwPickupLocationStatusDto {

    @ApiProperty({
        description: 'Status de la ubicacion BTW - TRUE (Activado) - FALSE(Desactivado)',
        example: true
    })
    @IsBoolean()
    btw_pickup_status: boolean;

    @ApiProperty({
        description: 'Persona que actualizó el status de la ubicaicon BTW',
        example: 'Mateo Torres'
    })
    @IsString()
    last_updated_by: string;

}