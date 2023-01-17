import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DiplomaQuestionInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  schoolYearId?: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  grades?: string;
}
