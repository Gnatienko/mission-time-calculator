import { Injectable } from "@nestjs/common"
const geolib = require("geolib")

@Injectable()
export class SpeedConvertorService {
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
}
