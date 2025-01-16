import { Test, TestingModule } from '@nestjs/testing';
import { GoalSettingsController } from './goal-settings.controller';

describe('GoalSettingsController', () => {
  let controller: GoalSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalSettingsController],
    }).compile();

    controller = module.get<GoalSettingsController>(GoalSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
