import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';
import { IsString } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
    @ApiProperty({
        description: 'Persona que actualizo el estudiante',
        example: 'Mateo Torres'
    })
    @IsString()
    last_updated_by: string;
}
