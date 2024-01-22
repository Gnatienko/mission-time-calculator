import { Injectable } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { AxiosResponse } from "axios"

@Injectable()
export class WindApiService {
  constructor(private readonly httpService: HttpService) {}

  async getWind(lon: any, lat: any): Promise<AxiosResponse<any>> {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_direction_10m,wind_speed_10m`

    try {
      const response = await this.httpService.get(apiUrl).toPromise()
      return response
    } catch (error: any) {
      const errorMessage =
        error.message || "An error occurred while fetching wind data."
      throw new Error(`Failed to fetch wind data: ${errorMessage}`)
    }
  }
}
