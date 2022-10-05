import { Resolver } from '@nestjs/graphql';
import { Period } from '../models/period.entity';

@Resolver((of) => Period)
export class PeriodResolver {
  constructor() {}
}
