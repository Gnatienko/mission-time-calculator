import { Controller, Get } from '@nestjs/common';
import { MissionService } from './mission.service';


@Controller('/mission/time')
export class MissionController {
    constructor(private readonly missionService: MissionService) {}

    @Get()
    getHello(): string {
      return this.missionService.getHello();
    }
}
