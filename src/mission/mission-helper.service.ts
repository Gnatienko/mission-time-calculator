import { Injectable } from "@nestjs/common"
import { MissionLink, AircraftData } from "./mission.types"
import { WindApiService } from "./wind-api/wind-api.service"
const geolib = require("geolib")

const AIRSPEED_KMH = 120

@Injectable()
export class MissionHelper {
  constructor(private readonly windApiService: WindApiService) {}
  toMS(KMHSpeed: number): number {
    const conversionFactor = 1000 / 3600
    const MSSpeed = KMHSpeed * conversionFactor
    return MSSpeed
  }

  calculateGroundSpeed(aircraftData: AircraftData): number {
    const thetaRad =
      (aircraftData.windDirection - aircraftData.heading) * (Math.PI / 180)
    const windComponent = aircraftData.windSpeed * Math.cos(thetaRad)
    const groundSpeed = aircraftData.airSpeed + windComponent

    return groundSpeed
  }

  calculateLinkTime(link: MissionLink): number {
    const airSpeed = this.toMS(AIRSPEED_KMH)
    const linkGroundSpeed = this.calculateGroundSpeed({
      airSpeed,
      windSpeed: link.windSpeed,
      windDirection: link.windDirection,
      heading: link.heading,
    })
    return link.lengthInM / linkGroundSpeed
  }

  async createMissionLinks(
    missionData: { lon: number; lat: number }[]
  ): Promise<MissionLink[]> {
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
    return missionLinks
  }
}
