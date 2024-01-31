import { Test, TestingModule } from "@nestjs/testing"
import { MissionHelper } from "./mission-helper.service"

describe("SpeedConvertorService", () => {
  let service: MissionHelper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionHelper],
    }).compile()

    service = module.get<MissionHelper>(MissionHelper)
  })

  describe("toMS", () => {
    it("should convert KM/H to M/s", () => {
      const kmhSpeed = 36
      const expectedMSSpeed = 10
      const result = service.toMS(kmhSpeed)

      expect(result).toBeCloseTo(expectedMSSpeed)
    })
  })

  describe("calculateGroundSpeed", () => {
    it("should correctly calculate ground speed", () => {
      const airSpeed = 100
      const windSpeed = 20
      const windDirection = 30
      const heading = 90
      const expectedGroundSpeed = 110
      const result = service.calculateGroundSpeed({
        airSpeed,
        windSpeed,
        windDirection,
        heading,
      })

      expect(result).toBe(expectedGroundSpeed)
    })
  })
})
