import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { PaginationInput } from './pagination.input';
import { StudentRecordFilterInput } from './student_record_filter.input';

@InputType()
@ArgsType()
export class StudentRecordSearchInput {
  @Field((type) => PaginationInput, { nullable: true })
  pagination: PaginationInput;

  @Field((type) => StudentRecordFilterInput, { nullable: true })
  filter: StudentRecordFilterInput;

  @Field((type) => String, { nullable: true })
  search_key?: string;
}
