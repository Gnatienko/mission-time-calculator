import { Injectable } from "@nestjs/common"
import { WindApiService } from "./wind-api/wind-api.service"
import { SpeedConvertorService } from "./mission-helper.service"

const geolib = require("geolib")

type MissionLink = {
  heading: number
  lengthInM: number
  windSpeed: number
  windDirection: number
}

@Injectable()
export class MissionService {
  constructor(
    private readonly windApiService: WindApiService,
    private readonly speedConvertorService: SpeedConvertorService
  ) {}

  async getMissionTime(
    missionData: { lon: number; lat: number }[]
  ): Promise<{ missionTime: number }> {
    const missionLinks: MissionLink[] = []

    for (let i = 0; i < missionData.length - 1; i++) {
      const startPoint = missionData[i]
      const endPoint = missionData[i + 1]

      const heading = geolib.getRhumbLineBearing(startPoint, endPoint)
      const lengthInM = geolib.getDistance(startPoint, endPoint)
      const { windSpeed, windDirection } = await this.windApiService.getWind(
        startPoint.lat,
        startPoint.lon
      )

      missionLinks.push({ heading, lengthInM, windSpeed, windDirection })
    }

    let missionTime = missionLinks.reduce((totalTime, link) => {
      const linkTime = this.speedConvertorService.calculateLinkTime(link)
      console.log(linkTime)

      return totalTime + linkTime
    }, 0)

    return { missionTime: Math.round(missionTime) }
  }
}
