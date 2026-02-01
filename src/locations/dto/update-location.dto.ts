import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';
import { IsString } from 'class-validator';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
    @ApiProperty({
        description: 'Persona que actualizó la ubicación',
        example: 'Mateo Torres'
    })
    @IsString()
    last_updated_by: string;
}
