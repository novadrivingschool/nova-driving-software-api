import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLocationTypeDto } from './create-location-type.dto';
import { IsString } from 'class-validator';

export class UpdateLocationTypeDto extends PartialType(CreateLocationTypeDto) {
    @ApiProperty({
        description: 'Persona que actualizo el tipo de ubicación',
        example: 'Mateo Torres',
        type: String
    })
    @IsString()
    last_updated_by: string;
}
