import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrUpdateSubjectInput {
  @Field(() => Int, { nullable: true })
  subject_id?: number;

  @Field(() => Int, { nullable: true })
  SchoolYearId: number | null;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  priority: number | null;

  @Field(() => Boolean, { nullable: true })
  allow_request: boolean;

  @Field(() => Boolean, { nullable: true })
  is_active: boolean;

  @Field(() => String, { nullable: true })
  periods: string;

  @Field(() => Boolean, { nullable: true })
  deleted: boolean;
}
