import { Test, TestingModule } from '@nestjs/testing';
import { PersonalTrainingServicesController } from './personal_training_services.controller';

describe('PersonalTrainingServicesController', () => {
  let controller: PersonalTrainingServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalTrainingServicesController],
    }).compile();

    controller = module.get<PersonalTrainingServicesController>(PersonalTrainingServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
