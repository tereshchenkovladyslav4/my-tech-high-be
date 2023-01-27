import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ReimbursementRequestFilterInput {
  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Field(() => [Int], { nullable: true })
  StudentIds?: number[];
}

@InputType()
@ArgsType()
export class ReimbursementRequestSearchInput {
  @Field(() => ReimbursementRequestFilterInput, { nullable: true })
  filter: ReimbursementRequestFilterInput;
}
