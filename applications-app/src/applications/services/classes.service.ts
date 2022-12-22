import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewClassInput } from '../dto/create-new-class.input';
import { Classes } from '../models/classes.entity';

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Classes)
        private readonly classesRepository: Repository<Classes>,
    ) { }

    async saveClass(createNewClassInput: CreateNewClassInput): Promise<Boolean> {
        await this.classesRepository.save(createNewClassInput);
        return true;
    }

    async deleteByMasterId(masterId: number): Promise<Boolean> {
        await this.classesRepository.delete({
            master_id: masterId
        });
        return true;
    }
}
