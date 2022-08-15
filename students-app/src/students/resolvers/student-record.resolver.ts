import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import {
  StudentRecord,
  StudentRecordPagination,
} from '../models/student-record.entity';
import { StudentRecordService } from '../services/student-record.service';
import { Pagination } from '../paginate';
import { StudentRecordSearchInput } from '../dto/student_record_search_input';

const STUDENT_RECORDS =
  'This is Query to get students with records by regionId and Filter parameter.';

const STUDENT_RECORDS_DOWNLOADALL =
  'This is Query to get url for download by filter.';

@Resolver((of) => StudentRecord)
export class StudentRecordResolver {
  constructor(private service: StudentRecordService) {}

  @Query((returns) => StudentRecordPagination, {
    name: 'studentRecords',
    description: STUDENT_RECORDS,
  })
  //@UseGuards(new AuthGuard())
  async getStudent(
    @Args() param: StudentRecordSearchInput,
  ): Promise<Pagination<StudentRecord>> {
    return this.service.find(param);
  }
}
