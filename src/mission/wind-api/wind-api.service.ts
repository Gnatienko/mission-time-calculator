import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class WindApiService {
  constructor(private readonly httpService: HttpService) {}

  async getWind(lon: any, lat: any): Promise<AxiosResponse<any>> {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_direction_10m,wind_gusts_10m`;
    
    return await this.httpService.get(apiUrl).toPromise();
  }
}
