import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindEventsByRegionIdSearch {
  @Field(() => Int, { nullable: true })
  region_id: number;

  @Field(() => String, { nullable: true })
  search_field?: string;

  @Field(() => Int, { nullable: true })
  parent_id?: number;
}
