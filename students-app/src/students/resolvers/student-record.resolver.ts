import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import {
  StudentRecord,
  StudentRecordPagination,
} from '../models/student-record.entity';
import { StudentRecordService } from '../services/student-record.service';
import { Pagination } from '../paginate';
import { StudentRecordSearchInput } from '../dto/student_record_search_input';
import { StudentRecordFile } from '../models/student-record-file.entity';
import { StudentRecordFileInput } from '../dto/student_record_file_input';
import { StudentRecordFileService } from '../services/student-record-file.service';

const STUDENT_RECORDS =
  'This is Query to get students with records by regionId and Filter parameter.';

@Resolver((of) => StudentRecord)
export class StudentRecordResolver {
  constructor(
    private service: StudentRecordService,
    private studentRecordFileServices: StudentRecordFileService,
  ) {}

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

  @Mutation((returns) => StudentRecordFile, {
    name: 'registerStudentRecordFile',
  })
  @UseGuards(new AuthGuard())
  async registerStudentRecordFile(
    @Args('createStudentRecordFileInput')
    createStudentRecordFileInput: StudentRecordFileInput,
  ): Promise<Boolean> {
    await this.studentRecordFileServices.save(createStudentRecordFileInput);
    return true;
  }
}
