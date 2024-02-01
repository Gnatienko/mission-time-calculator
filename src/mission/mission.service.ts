import { Injectable } from "@nestjs/common"
import { MissionHelper } from "./mission-helper.service"

const geolib = require("geolib")

@Injectable()
export class MissionService {
  constructor(private readonly missionHelper: MissionHelper) {}

  async getMissionTime(
    missionData: { lon: number; lat: number }[]
  ): Promise<{ missionTime: number }> {
    const missionLinks =
      await this.missionHelper.createMissionLinks(missionData)

    const missionTime = missionLinks.reduce((totalTime, link) => {
      const linkTime = this.missionHelper.calculateLinkTime(link)
      return totalTime + linkTime
    }, 0)

    return { missionTime: Math.round(missionTime) }
  }
}
