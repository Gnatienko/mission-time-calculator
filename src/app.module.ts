import { Module } from "@nestjs/common";

import { MissionModule } from "./mission/mission.module";

@Module({
  imports: [MissionModule],
})
export class AppModule {}
