import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator";


export class UpdateHighschoolStatus {

    @ApiProperty({
        description: 'Status del colegio - TRUE (Activado) - FALSE(Desactivado)',
        example: true
    })
    @IsBoolean()
    highschool_status: boolean;

    @ApiProperty({
        description: 'Persona que actualizó el status del colegio',
        example: 'Mateo Torres'
    })
    @IsString()
    last_updated_by: string;

}