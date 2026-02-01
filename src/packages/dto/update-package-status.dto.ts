import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsString } from "class-validator";


export class UpdatePackageStatusDto {

    @ApiProperty({
        description: 'Status del paquete',
        example: 'true'
    })
    @IsBoolean()
    package_status: boolean;

    @ApiProperty({
        description: 'Persona que actualizó el status del paquete',
        example: 'Mateo Torres'
    })
    @IsString()
    last_updated_by: string;

}