import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateUserRegionInput {
  @Field(() => [Int])
  @IsNotEmpty()
  id?: [number];

  @Field(() => [Int])
  @IsNotEmpty()
  region_id?: [number];

  @Field(() => Int, { nullable: true })
  @IsNotEmpty()
  user_id?: number;

  @Field(() => Int, { nullable: true })
  @IsNotEmpty()
  creator_id?: number;
}
