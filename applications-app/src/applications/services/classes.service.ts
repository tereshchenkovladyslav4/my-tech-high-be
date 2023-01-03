import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewClassInput } from '../dto/create-new-class.input';
import { Classes } from '../models/classes.entity';
import { HomeroomStudentService } from './homeroom-student.service';

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Classes)
        private readonly classesRepository: Repository<Classes>,
        private homeroomStudentService: HomeroomStudentService,
    ) { }

    async saveClass(createNewClassInput: CreateNewClassInput): Promise<Boolean> {
        await this.classesRepository.save(createNewClassInput);
        return true;
    }

    async deleteByMasterId(masterId: number): Promise<Boolean> {
        // const classes = await this.classesRepository.find({ master_id: masterId });
        // for (let i = 0; i < classes.length; i++) {
        //     await this.homeroomStudentService.deleteByClassId(classes[i].class_id);
        // }
        await this.classesRepository.delete({
            master_id: masterId
        });
        return true;
    }

    async deleteClassesById(classId: number): Promise<Boolean> {
        // await this.homeroomStudentService.deleteByClassId(classId);
        await this.classesRepository.delete({
            class_id: classId
        });
        return true;
    }
}
