import { Test, TestingModule } from '@nestjs/testing';
import { ChangingStationsService } from './changing-stations.service';

describe('ChangingStationsService', () => {
  let service: ChangingStationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangingStationsService],
    }).compile();

    service = module.get<ChangingStationsService>(ChangingStationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
