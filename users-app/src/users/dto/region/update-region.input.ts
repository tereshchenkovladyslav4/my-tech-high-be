import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateRegionInput {
  @Field(() => Int)
  @IsNotEmpty()
  id?: number;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  name?: string;

  @Field(() => String, { nullable: true })
  program?: string;

  @Field(() => String, { nullable: true })
  state_logo?: string;

  @Field(() => String, { nullable: true })
  county_file_name?: string;

  @Field(() => String, { nullable: true })
  county_file_path?: string;

  @Field(() => String, { nullable: true })
  county_array?: string;

  @Field(() => String, { nullable: true })
  school_district_file_name?: string;

  @Field(() => String, { nullable: true })
  school_district_file_path?: string;

  @Field(() => String, { nullable: true })
  school_district_array?: string;
}
