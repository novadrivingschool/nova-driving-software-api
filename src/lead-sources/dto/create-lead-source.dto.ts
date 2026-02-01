import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateLeadSourceDto {

    @ApiProperty({
        description: 'ID único de la fuente de origen',
        example: 'LS-001'
    })
    @IsString()
    source_id: string;

    @ApiProperty({
        description: 'Nombre de la fuente (ej. Facebook, Recomendación, Google)',
        example: 'Google Ads'
    })
    @IsString()
    source_name: string;

    @ApiProperty({
        description: 'Estado de la fuente - TRUE (Activo), FALSE (Inactivo)',
        example: true
    })
    @IsBoolean()
    source_status: boolean;

    @ApiProperty({
        description: 'Persona que creó el registro',
        example: 'Mateo Torres'
    })
    @IsString() 
    created_by: string;
}