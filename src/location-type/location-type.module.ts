import { Module } from '@nestjs/common';
import { LocationTypeService } from './location-type.service';
import { LocationTypeController } from './location-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationType } from './entities/location-type.entity';

@Module({
  controllers: [LocationTypeController],
  providers: [LocationTypeService],
  imports:[
    TypeOrmModule.forFeature([LocationType])
  ]
})
export class LocationTypeModule {}
