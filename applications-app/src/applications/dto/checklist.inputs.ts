import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ChecklistInput {
  @Field(() => Int)
  id?: number;

  @Field(() => Int)
  region_id?: number;

  @Field(() => String, { nullable: true })
  checklist_id?: string;

  @Field(() => Int, { nullable: true })
  school_year_id?: number | null;

  @Field(() => Int, { nullable: true })
  grade?: number;

  @Field(() => String, { nullable: true })
  goal?: string;

  @Field(() => String, { nullable: true })
  subject?: string;

  @Field(() => String, { nullable: true })
  status?: string;
}
