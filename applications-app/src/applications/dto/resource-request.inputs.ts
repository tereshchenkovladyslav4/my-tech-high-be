import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ResourceRequestInput {
  @Field(() => Int, { nullable: true })
  student_id?: number;

  @Field(() => Int, { nullable: true })
  resource_id?: number;

  @Field(() => Int, { nullable: true })
  course_id?: number;
}
