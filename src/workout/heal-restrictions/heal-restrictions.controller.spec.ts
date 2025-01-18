import { Test, TestingModule } from '@nestjs/testing';
import { HealRestrictionsController } from './heal-restrictions.controller';

describe('HealRestrictionsController', () => {
  let controller: HealRestrictionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealRestrictionsController],
    }).compile();

    controller = module.get<HealRestrictionsController>(HealRestrictionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
