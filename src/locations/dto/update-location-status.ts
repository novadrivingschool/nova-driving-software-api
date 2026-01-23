import { IsEnum, IsString } from "class-validator"
import { LocationStatus } from "./create-location.dto"
import { ApiProperty } from "@nestjs/swagger"


export class UpdateLocationStatusDto {

    @ApiProperty({
        description: 'Status de la ubicación',
        example: LocationStatus.ACTIVE,
        enum: LocationStatus
    })
    @IsEnum(LocationStatus)
    location_status: LocationStatus
}