import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutPlanWeekController } from './workout-plan-week.controller';

describe('WorkoutPlanWeekController', () => {
  let controller: WorkoutPlanWeekController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutPlanWeekController],
    }).compile();

    controller = module.get<WorkoutPlanWeekController>(WorkoutPlanWeekController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
