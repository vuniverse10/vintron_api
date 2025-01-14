import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutPlanDurationController } from './workout-plan-duration.controller';

describe('WorkoutPlanDurationController', () => {
  let controller: WorkoutPlanDurationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutPlanDurationController],
    }).compile();

    controller = module.get<WorkoutPlanDurationController>(WorkoutPlanDurationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
