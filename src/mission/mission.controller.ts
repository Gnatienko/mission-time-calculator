import { WindApiService } from './wind-api/wind-api.service';
import { Controller, Get, Query } from '@nestjs/common';
import { MissionService } from './mission.service';

@Controller('/mission/time')
export class MissionController {
    constructor(private readonly missionService: MissionService, private readonly windApiService: WindApiService) {}

    @Get()
    async getMissionData(@Query('lon') lon: number, @Query('lat') lat: number): Promise<{ mission: string, windData: any }> {
        const missionData = (await this.missionService.getMissionData(lon, lat)).mission;
        const windData = (await this.missionService.getMissionData(lon, lat)).windData;

        return { mission: missionData, windData: windData };
    }
}
