import { Injectable } from "@nestjs/common"
import { WindApiService } from "./wind-api/wind-api.service"
import { SpeedConvertorService } from "./speed-convertor/speed-convertor.service"

const geolib = require("geolib")
const AIRSPEED_KMH = 120

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
      const airSpeed = this.speedConvertorService.toMS(AIRSPEED_KMH)
      const linkGroundSpeed = this.speedConvertorService.calculateGroundSpeed(
        airSpeed,
        link.windSpeed,
        link.windDirection,
        link.heading
      )
      const linkTime = link.lengthInM / linkGroundSpeed

      return totalTime + linkTime
    }, 0)

    return { missionTime: Math.round(missionTime) }
  }
}
