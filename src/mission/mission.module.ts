import { Module } from "@nestjs/common";
import { MissionController } from "./mission.controller";
import { MissionService } from "./mission.service";
import { WindApiService } from "./wind-api/wind-api.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [MissionController],
  providers: [MissionService, WindApiService],
})
export class MissionModule {}
