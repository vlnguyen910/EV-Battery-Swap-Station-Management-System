import { Test, TestingModule } from '@nestjs/testing';
import { ChangingStationsController } from './changing-stations.controller';
import { ChangingStationsService } from './changing-stations.service';

describe('ChangingStationsController', () => {
  let controller: ChangingStationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangingStationsController],
      providers: [ChangingStationsService],
    }).compile();

    controller = module.get<ChangingStationsController>(ChangingStationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
