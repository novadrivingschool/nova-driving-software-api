import { Module } from '@nestjs/common';
import { BtwPickupLocationsService } from './btw-pickup-locations.service';
import { BtwPickupLocationsController } from './btw-pickup-locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BtwPickupLocation } from './entities/btw-pickup-location.entity';

@Module({
  controllers: [BtwPickupLocationsController],
  providers: [BtwPickupLocationsService],
  imports: [
    TypeOrmModule.forFeature([BtwPickupLocation])
  ]
})
export class BtwPickupLocationsModule { }
