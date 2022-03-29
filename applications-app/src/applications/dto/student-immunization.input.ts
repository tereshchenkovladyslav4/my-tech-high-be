import { Field, ID, Int, InputType } from '@nestjs/graphql';

@InputType()
export class StudentImmunizationInput {
  @Field(() => ID, { nullable: true })
  student_id?: number;

  @Field(() => ID, { nullable: true })
  immunization_id?: number;

  @Field({ nullable: true })
  value?: string;

  @Field(() => Int, { nullable: true })
  updated_by?: number;

  @Field(() => Date, { nullable: true })
  date_created?: Date;

  @Field(() => Date, { nullable: true })
  date_updated?: Date;
}
