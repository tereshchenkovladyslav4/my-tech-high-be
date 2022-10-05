import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentRecordFileInput } from '../dto/student_record_file_input';
import { StudentRecordFile } from '../models/student-record-file.entity';
@Injectable()
export class StudentRecordFileService {
  constructor(
    @InjectRepository(StudentRecordFile)
    private readonly repo: Repository<StudentRecordFile>,
  ) {}

  async save(createStudentRecordFileInput: StudentRecordFileInput): Promise<StudentRecordFile> {
    try {
      const result = await this.repo.save(createStudentRecordFileInput);
      return result;
    } catch (error) {
      return error;
    }
  }
}
