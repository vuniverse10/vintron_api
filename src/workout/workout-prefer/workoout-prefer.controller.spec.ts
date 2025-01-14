import { Test, TestingModule } from '@nestjs/testing';
import { WorkooutPreferController } from './workout-prefer.controller';

describe('WorkooutPreferController', () => {
  let controller: WorkooutPreferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkooutPreferController],
    }).compile();

    controller = module.get<WorkooutPreferController>(WorkooutPreferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
