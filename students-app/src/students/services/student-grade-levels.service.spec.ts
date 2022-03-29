import { Test, TestingModule } from '@nestjs/testing';
import { StudentGradeLevelsService } from './student-grade-levels.service';

describe('StudentGradeLevelsService', () => {
  let service: StudentGradeLevelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentGradeLevelsService],
    }).compile();

    service = module.get<StudentGradeLevelsService>(StudentGradeLevelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
