import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class StudentRecordFileInput {
  @Field((type) => Int, {
    nullable: true,
    description: 'This is primary id of mth_student_record_file table',
  })
  record_file_id?: number;

  @Field((type) => Number, {
    nullable: true,
    description: 'This is RecordId of mth_student_record_file table',
  })
  RecordId: number;

  @Field((type) => Number, {
    nullable: true,
    description: 'This is FileId of mth_student_record_file table. This is related with file_id of mth_file table',
  })
  FileId: number;

  @Field((type) => String, {
    nullable: true,
    description: 'This is file_kind of mth_student_record_file table',
  })
  file_kind: string;
}
