import { Test, TestingModule } from '@nestjs/testing';
import { HydrationController } from './hydration.controller';

describe('HydrationController', () => {
  let controller: HydrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HydrationController],
    }).compile();

    controller = module.get<HydrationController>(HydrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
