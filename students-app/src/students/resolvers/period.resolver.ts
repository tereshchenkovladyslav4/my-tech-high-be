import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { Period } from '../models/period.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { PeriodService } from '../services/period.service';

@Resolver((of) => Period)
export class PeriodResolver {
  constructor(private service: PeriodService) {}

  @Query((returns) => [Period], { name: 'studentPeriods' })
  @UseGuards(new AuthGuard())
  get(
    @Args({ name: 'studentId', type: () => ID }) studentId: number,
    @Args({ name: 'schoolYearId', type: () => ID }) schoolYearId: number,
    @Args({ name: 'isGradeFilter', type: () => Boolean }) isGradeFilter: boolean,
  ): Promise<Period[]> {
    return this.service.find(studentId, schoolYearId, isGradeFilter);
  }
}
