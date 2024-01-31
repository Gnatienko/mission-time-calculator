import { Injectable } from "@nestjs/common"
import { WindApiService } from "./wind-api/wind-api.service"
import { MissionHelper } from "./mission-helper.service"
import { MissionLink } from "./mission.types"

const geolib = require("geolib")

@Injectable()
export class MissionService {
  constructor(
    private readonly windApiService: WindApiService,
    private readonly speedConvertorService: MissionHelper
  ) {}

  async getMissionTime(
    missionData: { lon: number; lat: number }[]
  ): Promise<{ missionTime: number }> {
    const missionLinksPromises: Promise<MissionLink>[] = missionData
      .slice(0, -1)
      .map(async (startPoint, index) => {
        const endPoint = missionData[index + 1]
        const heading = geolib.getRhumbLineBearing(startPoint, endPoint)
        const lengthInM = geolib.getDistance(startPoint, endPoint)
        const { windSpeed, windDirection } = await this.windApiService.getWind(
          startPoint.lat,
          startPoint.lon
        )

        return { heading, lengthInM, windSpeed, windDirection }
      })

    const missionLinks = await Promise.all(missionLinksPromises)

    const missionTime = missionLinks.reduce((totalTime, link) => {
      const linkTime = this.speedConvertorService.calculateLinkTime(link)
      console.log(linkTime)
      return totalTime + linkTime
    }, 0)

    return { missionTime: Math.round(missionTime) }
  }
}
