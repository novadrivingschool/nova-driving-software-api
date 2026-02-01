import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class UpdateLeadSourceStatusDto {

    @ApiProperty({
        description: 'Estado de la fuente de origen - TRUE (Activado) - FALSE (Desactivado)',
        example: true
    })
    @IsBoolean()
    source_status: boolean;

    @ApiProperty({
        description: 'Persona que actualizó el estado de la fuente',
        example: 'Mateo Torres'
    })
    @IsString()
    last_updated_by: string;

}