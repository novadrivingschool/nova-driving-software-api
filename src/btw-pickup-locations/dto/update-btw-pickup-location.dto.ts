import { PartialType } from '@nestjs/swagger';
import { CreateBtwPickupLocationDto } from './create-btw-pickup-location.dto';

export class UpdateBtwPickupLocationDto extends PartialType(CreateBtwPickupLocationDto) {}
