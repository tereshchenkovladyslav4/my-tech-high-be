import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ReimbursementRequestFilterInput {
  @Field((type) => Int, { nullable: true })
  SchoolYearId: number;

  @Field((type) => [Int], { nullable: true })
  StudentIds?: number[];
}

@InputType()
@ArgsType()
export class ReimbursementRequestSearchInput {
  @Field((type) => ReimbursementRequestFilterInput, { nullable: true })
  filter: ReimbursementRequestFilterInput;
}
