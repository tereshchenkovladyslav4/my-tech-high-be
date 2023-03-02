import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CloneRegionInput {
  @Field(() => String)
  new_region_name: string;

  @Field(() => Int)
  to_be_clone_region_id: number;
}
