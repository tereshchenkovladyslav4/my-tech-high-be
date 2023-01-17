import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindEventsByRegionIdSearch {
  @Field(() => Int, { nullable: true })
  region_id: number;

  @Field(() => String, { nullable: true })
  search_field?: string;

  @Field(() => Int, { nullable: true })
  user_id?: number;

  @Field(() => Int, { nullable: true })
  type?: 'parent' | 'student';
}
