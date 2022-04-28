import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsDate,
  MaxLength,
  IsEmail,
  IsNotEmpty,
  Length,
  IsInt,
} from 'class-validator';

@InputType()
export class ObserverInput {
  @Field((type) => Int, { nullable: true })
  observer_id?: number;

  @Field((type) => Int, { nullable: true })
  parent_id?: number;

  @Field((type) => [Int], { nullable: true })
  student_ids?: number[];

  @Field((type) => String, { nullable: true })
  @MaxLength(60)
  first_name?: string;

  @Field((type) => String, { nullable: true })
  @MaxLength(60)
  last_name?: string;

  @Field((type) => String, { nullable: true })
  @IsEmail()
  email?: string;

  @Field((type) => String, { nullable: true })
  notes?: string;

  @Field(() => [Int], { nullable: true })
  regions?: [number];
}
