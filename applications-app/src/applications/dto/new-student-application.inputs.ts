import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsInt, MaxLength, Min, IsDate } from 'class-validator';

@InputType()
export class CreateStudentApplicationInput {
  @Field(() => Int)
  @IsInt()
  student_id?: number;

  @Field(() => Int)
  @IsInt()
  school_year_id?: number;

  @Field({ defaultValue: 'Submitted' })
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  city_of_residence?: string;

  @Field({ nullable: true })
  @MaxLength(120)
  @IsOptional()
  referred_by?: string;

  @Field({ nullable: true })
  @Min(1)
  @IsInt()
  @IsOptional()
  agrees_to_policies?: number;

  @Field({ defaultValue: new Date() })
  @IsDate()
  date_started?: Date;

  @Field({ defaultValue: new Date() })
  @IsDate()
  date_submitted?: Date;

  @Field(() => String, { nullable: true })
  meta?: string;
}
