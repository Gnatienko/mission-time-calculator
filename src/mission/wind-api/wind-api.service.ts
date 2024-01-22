import { Injectable } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { firstValueFrom } from "rxjs"

@Injectable()
export class WindApiService {
  constructor(private readonly httpService: HttpService) {}

  async getWind(
    lon: any,
    lat: any
  ): Promise<{ windSpeed: number; windDirection: number }> {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_direction_10m,wind_speed_10m`

    try {
      const response = await firstValueFrom(this.httpService.get(apiUrl))
      const windSpeed = response.data.current.wind_speed_10m
      const windDirection = response.data.current.wind_direction_10m

      return { windSpeed, windDirection }
    } catch (error: any) {
      const errorMessage =
        error.message || "An error occurred while fetching wind data."
      throw new Error(`Failed to fetch wind data: ${errorMessage}`)
    }
  }
}
