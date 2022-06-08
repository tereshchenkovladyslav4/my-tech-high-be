import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateEventTypeInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  event_type_id?: number;

  @Field((type) => Int, { nullable: true })
  @IsInt()
  RegionId: number | null;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  color?: string;

  @Field((type) => Int, { nullable: true })
  @IsInt()
  priority?: number;

  @Field((type) => Boolean, { nullable: true })
  archived?: boolean;
}

@InputType()
export class UpdateEventTypeInputs {
  @Field((type) => [UpdateEventTypeInput], { nullable: true })
  updateEventTypes: UpdateEventTypeInput[];
}
