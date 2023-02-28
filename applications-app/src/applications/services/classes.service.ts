import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewClassInput } from '../dto/create-new-class.input';
import { ResponseDTO } from '../dto/response.dto';
import { Classes } from '../models/classes.entity';
import { HomeroomStudentService } from './homeroom-student.service';
import { StudentLearningLogService } from './student-learning-log.service';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Classes)
    private readonly classesRepository: Repository<Classes>,
    private homeroomStudentService: HomeroomStudentService,
    private studentLearningLogService: StudentLearningLogService,
  ) {}
  async saveClass(createNewClassInput: CreateNewClassInput): Promise<boolean> {
    await this.classesRepository.save(createNewClassInput);
    return true;
  }

  async deleteByMasterId(masterId: number): Promise<boolean> {
    // const classes = await this.classesRepository.find({ master_id: masterId });
    // for (let i = 0; i < classes.length; i++) {
    //     await this.homeroomStudentService.deleteByClassId(classes[i].class_id);
    // }
    await this.classesRepository.delete({
      master_id: masterId,
    });
    return true;
  }

  async deleteClassesById(classId: number): Promise<boolean> {
    // await this.homeroomStudentService.deleteByClassId(classId);
    await this.classesRepository.delete({
      class_id: classId,
    });
    return true;
  }

  async getTeachersByUserId(userId: number): Promise<ResponseDTO> {
    try {
      const resultClasses = await this.classesRepository
        .createQueryBuilder('classes')
        .leftJoinAndSelect('classes.PrimaryTeacher', 'primaryTeacher')
        .leftJoinAndSelect('classes.HomeroomStudents', 'HomeroomStudents')
        .getMany();

      let responseData = [];
      responseData = await Promise.all(
        resultClasses.map(async (obj) => {
          const ungraded = await this.studentLearningLogService.getUngradedLearningLogs(obj.master_id);
          return { ...obj, ungraded };
        }),
      );
      return <ResponseDTO>{
        error: false,
        message: 'Fetch Successfully',
        results: responseData,
      };
    } catch (error) {
      return <ResponseDTO>{
        error: true,
        message: 'Fetch Failed',
      };
    }
  }

  async getClassById(classId: number): Promise<Classes> {
    try {
      return await this.classesRepository.findOne({ where: { class_id: +classId } });
    } catch (error) {
      return error;
    }
  }
}
