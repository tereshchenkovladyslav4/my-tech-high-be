import { Test, TestingModule } from '@nestjs/testing';
import { ParentsResolver } from './parents.resolver';

describe('ParentsResolver', () => {
  let resolver: ParentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParentsResolver],
    }).compile();

    resolver = module.get<ParentsResolver>(ParentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
