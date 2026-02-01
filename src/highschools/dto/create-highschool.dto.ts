import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateHighschoolDto {

    @ApiProperty({
        description: 'ID del colegio',
        example: 'HS-1'
    })
    @IsString()
    highschool_id: string;

    @ApiProperty({
        description: 'Nombre del colegio',
        example: 'Lorem ipsum'
    })
    @IsString()
    highschool_name: string;

    @ApiProperty({
        description: 'Direccion del colegio',
        example: 'Fulerton avenue'
    })
    @IsOptional()
    @IsString()
    highschool_address: string;

    @ApiProperty({
        description: 'Estado del colegio -  TRUE (Activada), FALSE(Desactivada)',
        example: true
    })
    @IsBoolean()
    highschool_status: boolean;

    @ApiProperty({
        description: 'Persona que creo el colegio',
        example: 'Mateo Torres'
    })
    @IsString()
    created_by: string;

}
