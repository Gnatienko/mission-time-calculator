import { Injectable } from "@nestjs/common"
import { WindApiService } from "./wind-api/wind-api.service"
import { SpeedConvertorService } from "./speed-convertor/speed-convertor.service"
import { link } from "fs"

const geolib = require("geolib")

@Injectable()
export class MissionService {
  constructor(
    private readonly windApiService: WindApiService,
    private readonly speedConvertorService: SpeedConvertorService
  ) {}

  async getMissionTime(
    missionData: { lon: number; lat: number }[] //assuming that altitude is const
  ): Promise<{ missionTime: number }> {
    const missionLinks: {
      heading: number
      lengthInM: number
      windSpeed: number
      windDirection: number
    }[] = []

    for (let i = 0; i < missionData.length - 1; i++) {
      const startPoint = missionData[i]
      const endPoint = missionData[i + 1]

      const heading = geolib.getRhumbLineBearing(startPoint, endPoint)
      const lengthInM = geolib.getDistance(startPoint, endPoint)
      const windData = await this.windApiService.getWind(
        startPoint.lat,
        startPoint.lon
      ) //assuming that links are not big and there is no point to calculate average wind data

      const windSpeed = windData.data.current.wind_speed_10m
      const windDirection = windData.data.current.wind_direction_10m

      missionLinks.push({ heading, lengthInM, windSpeed, windDirection })
    }

    let missionTime = 0
    let airSpeedInKMH = 120

    for (const link of missionLinks) {
      const airSpeed = this.speedConvertorService.toMS(airSpeedInKMH)
      const linkGroundSpeed = this.speedConvertorService.calculateGroundSpeed(
        airSpeed,
        link.windSpeed,
        link.windDirection,
        link.heading
      )
      const linkTime = link.lengthInM / linkGroundSpeed

      missionTime += linkTime
      console.log(linkGroundSpeed)
    }
    console.log(missionLinks)
    console.log(missionTime)

    console.log("---------")

    return { missionTime: missionTime }
  }
}

//перебераем все координаты миссии
//находи градус нправления и дистанцию ланки
//находим ветер для каждой пары через апи
//считаем влияние ветра на скорость
//считаем время из дистанции и средней скорости
