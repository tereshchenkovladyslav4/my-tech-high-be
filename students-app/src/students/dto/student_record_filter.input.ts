import { Field, Int, InputType, ArgsType } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class StudentRecordFilterInput {
  @Field((type) => Int, { nullable: true })
  school_year_id: number;

  @Field((type) => String, { nullable: true })
  grade_level_1?: string;

  @Field((type) => String, { nullable: true })
  grade_level_2?: string;

  @Field((type) => String, { nullable: true })
  program_year?: string;

  @Field((type) => String, { nullable: true })
  program_year_status?: string;

  @Field((type) => String, { nullable: true })
  enrollment_status?: string;

  @Field((type) => String, { nullable: true })
  school_of_enrollment?: string;

  @Field((type) => String, { nullable: true })
  special_ed?: string;

  @Field((type) => String, { nullable: true })
  enrollment_packet_document?: string;

  @Field((type) => String, { nullable: true })
  other?: string;

  @Field((type) => String, { nullable: true })
  date_range_start?: string;

  @Field((type) => String, { nullable: true })
  date_range_end?: string;
}
