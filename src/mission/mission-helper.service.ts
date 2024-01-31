import { Injectable } from "@nestjs/common"
import { MissionLink } from "./mission.types"

const AIRSPEED_KMH = 120

@Injectable()
export class MissionHelper {
  toMS(KMHSpeed: number): number {
    const conversionFactor = 1000 / 3600
    const MSSpeed = KMHSpeed * conversionFactor
    return MSSpeed
  }

  calculateGroundSpeed(
    airSpeed: number,
    windSpeed: number,
    windDirection: number,
    heading: number
  ): number {
    const thetaRad = (windDirection - heading) * (Math.PI / 180)
    const windComponent = windSpeed * Math.cos(thetaRad)
    const groundSpeed = airSpeed + windComponent

    return groundSpeed
  }

  calculateLinkTime(link: MissionLink): number {
    const airSpeed = this.toMS(AIRSPEED_KMH)
    const linkGroundSpeed = this.calculateGroundSpeed(
      airSpeed,
      link.windSpeed,
      link.windDirection,
      link.heading
    )
    return link.lengthInM / linkGroundSpeed
  }
}
