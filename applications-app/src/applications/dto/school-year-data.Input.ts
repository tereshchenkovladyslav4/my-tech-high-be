import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class SchoolYearDataInput {
  @Field(() => Int)
  @IsInt()
  school_year_id?: number;

  @Field(() => Int)
  @IsInt()
  region_id?: number;
}
