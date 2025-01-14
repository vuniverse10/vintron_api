import { Test, TestingModule } from '@nestjs/testing';
import { ExcelImportService } from './excel-import.service';

describe('ExcelImportService', () => {
  let service: ExcelImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcelImportService],
    }).compile();

    service = module.get<ExcelImportService>(ExcelImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
