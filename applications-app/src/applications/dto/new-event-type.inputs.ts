import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateEventTypeInput {
  @Field(() => Int, { nullable: true })
  RegionId: number | null;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  color?: string;

  @Field(() => Int, { nullable: true })
  priority?: number;

  @Field(() => Boolean, { nullable: true })
  archived?: boolean;
}
