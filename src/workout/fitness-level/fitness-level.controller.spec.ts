import { Test, TestingModule } from '@nestjs/testing';
import { FitnessLevelController } from './fitness-level.controller';

describe('FitnessLevelController', () => {
  let controller: FitnessLevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FitnessLevelController],
    }).compile();

    controller = module.get<FitnessLevelController>(FitnessLevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
