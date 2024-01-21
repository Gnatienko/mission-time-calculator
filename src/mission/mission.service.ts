import { Injectable } from '@nestjs/common';
import { WindApiService } from './wind-api/wind-api.service';

@Injectable()
export class MissionService {
  constructor(private readonly windApiService: WindApiService) {}

  async getMissionData(lon: number, lat: number): Promise<{ mission: string, windData: any }> {
    const missionData = 'Hello from MissionService!';
    const windData = await this.windApiService.getWind(lon, lat);
    console.log(windData)


    return { mission: missionData, windData: windData.data };
  }


}
