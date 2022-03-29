import { Test, TestingModule } from '@nestjs/testing';
import { StudentStatusResolver } from './student-status.resolver';

describe('StudentStatusResolver', () => {
  let resolver: StudentStatusResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentStatusResolver],
    }).compile();

    resolver = module.get<StudentStatusResolver>(StudentStatusResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
