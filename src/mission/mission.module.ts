import { Module } from "@nestjs/common";
import { MissionController } from "./mission.controller";
import { MissionService } from "./mission.service";
import { WindApiService } from "./wind-api/wind-api.service";
import { HttpModule } from "@nestjs/axios";
import { SpeedConvertorService } from './speed-convertor/speed-convertor.service';

@Module({
  imports: [HttpModule],
  controllers: [MissionController],
  providers: [MissionService, WindApiService, SpeedConvertorService],
})
export class MissionModule {}
