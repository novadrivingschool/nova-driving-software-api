import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLeadSourceDto } from './create-lead-source.dto';
import { IsString } from 'class-validator';

export class UpdateLeadSourceDto extends PartialType(CreateLeadSourceDto) {
    @ApiProperty({
        description: 'Persona que actualizó el estado de la fuente',
        example: 'Mateo Torres'
    })
    @IsString()
    last_updated_by: string;
}
