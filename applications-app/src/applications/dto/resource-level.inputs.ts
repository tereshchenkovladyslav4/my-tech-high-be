import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ResourceLevelInput {
  @Field(() => Int, { nullable: true })
  resource_level_id?: number;

  @Field(() => Int, { nullable: true })
  resource_id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Float, { nullable: true })
  limit: number | null;
}
