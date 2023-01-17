import { Resolver } from '@nestjs/graphql';
import { Period } from '../models/period.entity';
import { PeriodService } from '../services/period.service';

@Resolver(() => Period)
export class PeriodResolver {
  constructor(private periodService: PeriodService) {}
}
