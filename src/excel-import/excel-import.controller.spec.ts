import { Test, TestingModule } from '@nestjs/testing';
import { ExcelImportController } from './excel-import.controller';

describe('ExcelImportController', () => {
  let controller: ExcelImportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcelImportController],
    }).compile();

    controller = module.get<ExcelImportController>(ExcelImportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
