import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateEventTypeInput {
  @Field((type) => Int, { nullable: true })
  RegionId: number | null;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  color?: string;

  @Field((type) => Int, { nullable: true })
  priority?: number;

  @Field((type) => Boolean, { nullable: true })
  archived?: boolean;
}
