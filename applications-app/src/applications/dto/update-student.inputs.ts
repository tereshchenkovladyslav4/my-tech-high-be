import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateStudentInput {
  @Field(() => Int)
  @IsInt()
  student_id?: number;

  @Field(() => String, { nullable: true })
  grade_level?: string;

  @Field(() => Int, { nullable: true })
  special_ed?: number;

  @Field(() => Int, { nullable: true })
  diploma_seeking?: number;

  @Field(() => Int, { nullable: true })
  status?: number;

  @Field(() => Int, { nullable: true })
  school_year_id?: number;

  @Field(() => String, { nullable: true })
  testing_preference?: string;

  @Field(() => String, { nullable: true })
  date?: string;

  @Field(() => String, { nullable: true })
  opt_out_form_signature_name?: string;

  @Field(() => Int, { nullable: true })
  opt_out_form_signature_file_id?: number;
}
