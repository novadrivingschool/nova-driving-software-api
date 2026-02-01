import { Module } from '@nestjs/common';
import { HighschoolsService } from './highschools.service';
import { HighschoolsController } from './highschools.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Highschool } from './entities/highschool.entity';

@Module({
  controllers: [HighschoolsController],
  providers: [HighschoolsService],
  imports: [
    TypeOrmModule.forFeature([Highschool])
  ]
})
export class HighschoolsModule { }
