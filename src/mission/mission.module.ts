import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { WindSpeedService } from './wind-speed/wind-speed.service';

@Module({
  controllers: [MissionController],
  providers: [MissionService, WindSpeedService]
})
export class MissionModule {}
