import { Test, TestingModule } from '@nestjs/testing';
import { WindSpeedService } from './wind-speed.service';

describe('WindSpeedService', () => {
  let service: WindSpeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WindSpeedService],
    }).compile();

    service = module.get<WindSpeedService>(WindSpeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
