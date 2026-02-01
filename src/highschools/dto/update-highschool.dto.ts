import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateHighschoolDto } from './create-highschool.dto';
import { IsString } from 'class-validator';

export class UpdateHighschoolDto extends PartialType(CreateHighschoolDto) {

    @ApiProperty({
        description: 'Persona que actualizo colegio',
        example: 'Lorem ipsum'
    })
    @IsString()
    last_updated_by: string;
}
