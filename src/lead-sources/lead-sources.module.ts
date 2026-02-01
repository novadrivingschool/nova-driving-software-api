import { Module } from '@nestjs/common';
import { LeadSourcesService } from './lead-sources.service';
import { LeadSourcesController } from './lead-sources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadSource } from './entities/lead-source.entity';

@Module({
  controllers: [LeadSourcesController],
  providers: [LeadSourcesService],
  imports: [
    TypeOrmModule.forFeature([LeadSource])
  ]
})
export class LeadSourcesModule { }
