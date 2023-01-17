import { Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength, IsEmail } from 'class-validator';

@InputType()
export class ObserverInput {
  @Field(() => Int, { nullable: true })
  observer_id?: number;

  @Field(() => Int, { nullable: true })
  parent_id?: number;

  @Field(() => [Int], { nullable: true })
  student_ids?: number[];

  @Field(() => String, { nullable: true })
  @MaxLength(60)
  first_name?: string;

  @Field(() => String, { nullable: true })
  @MaxLength(60)
  last_name?: string;

  @Field(() => String, { nullable: true })
  @IsEmail()
  email?: string;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => [Int], { nullable: true })
  regions?: [number];
}
