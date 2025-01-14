import { Test, TestingModule } from '@nestjs/testing';
import { BodyFocusAreaController } from './body-focus-area.controller';

describe('BodyFocusAreaController', () => {
  let controller: BodyFocusAreaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BodyFocusAreaController],
    }).compile();

    controller = module.get<BodyFocusAreaController>(BodyFocusAreaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
