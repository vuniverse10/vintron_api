import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsPreferTimingsController } from './workouts-prefer-timings.controller';

describe('WorkoutsPreferTimingsController', () => {
  let controller: WorkoutsPreferTimingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutsPreferTimingsController],
    }).compile();

    controller = module.get<WorkoutsPreferTimingsController>(WorkoutsPreferTimingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
