import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateScheduleInput {
  @Field(() => Int, { nullable: true })
  schedule_id?: number;

  @Field(() => Int, { nullable: true })
  SchoolYearId: number | null;

  @Field(() => Int, { nullable: true })
  StudentId: number | null;

  @Field(() => String, { nullable: true })
  status: string | null;

  @Field(() => Boolean, { nullable: true })
  is_second_semester: boolean;
}
