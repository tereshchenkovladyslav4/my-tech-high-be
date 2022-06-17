import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCronJobsLogInput {
  @Field(() => String, { nullable: true })
  function_name?: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  log?: string;
}
