import { Injectable } from "@nestjs/common"
import { WindApiService } from "./wind-api/wind-api.service"
const geolib = require("geolib")

@Injectable()
export class MissionService {
  constructor(private readonly windApiService: WindApiService) {}

  async getMissionData(
    missionData: { lon: number; lat: number }[] //assuming that altitude is const
  ): Promise<{ mission: number }> {
    const missionLinks: {
      direction: number
      lengthInM: number
      windSpeed: number
      windDirection: number
    }[] = []
    const droneSpeed = 120 / 3.6 //   km/h->m/s

    for (let i = 0; i < missionData.length - 1; i++) {
      const startPoint = missionData[i]
      const endPoint = missionData[i + 1]

      const direction = geolib.getRhumbLineBearing(startPoint, endPoint)
      const lengthInM = geolib.getDistance(startPoint, endPoint)
      const windData = await this.windApiService.getWind(
        startPoint.lat,
        startPoint.lon
      ) //assuming that links are not big and there is no point to calculate average wind data
      const windSpeed = windData.data.current.wind_speed_10m
      const windDirection = windData.data.current.wind_direction_10m

      missionLinks.push({ direction, lengthInM, windSpeed, windDirection })
    }
    console.log(missionLinks)
    console.log("---------")

    const missionTime = 1

    return { mission: missionTime }
  }
}

//перебераем все координаты миссии
//находи градус нправления и дистанцию ланки
//находим ветер для каждой пары через апи
//считаем влияние ветра на скорость
//считаем время из дистанции и средней скорости
