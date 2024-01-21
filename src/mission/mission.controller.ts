import { Controller, Post, Body } from '@nestjs/common';
import { MissionService } from './mission.service';

@Controller('/mission/time')
export class MissionController {
    constructor(private readonly missionService: MissionService) {}

    @Post()
    async getMissionData(@Body()body: { lon: number; lat: number }): Promise<{ missionTime: string }> {
        const missionTime = (await this.missionService.getMissionData(body.lon, body.lat)).mission;



        return { missionTime: missionTime };
    }
}
