import { Test, TestingModule } from '@nestjs/testing';
import { MealTypesController } from './meal-types.controller';

describe('MealTypesController', () => {
  let controller: MealTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealTypesController],
    }).compile();

    controller = module.get<MealTypesController>(MealTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
