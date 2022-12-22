import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { Master } from '../models/master.entity';
import { CreateNewMasterInput } from '../dto/create-new-master.input';
import { CreateOrUpdateInstructions } from '../dto/create-new-master-instruction.input';
import { ClassesService } from './classes.service';

@Injectable()
export class MasterService {
    constructor(
        @InjectRepository(Master)
        private readonly masterRepository: Repository<Master>,
        private classesService: ClassesService,
    ) { }

    async getAll(schoolYearId: number): Promise<Master[]> {

        const result = await this.masterRepository
            .createQueryBuilder('master')
            .leftJoinAndSelect('master.masterClasses', 'masterClasses')
            .leftJoinAndSelect('master.masterAssignments', 'masterAssignments')
            .leftJoinAndSelect('masterClasses.primaryTeacher', 'primaryTeacher')
            .leftJoinAndSelect('masterClasses.homeroomStudent', 'homeroomStudent')
            .where('master.school_year_id = :schoolYearId', { schoolYearId: schoolYearId })
            .getMany();

        return result;
    }

    async getById(masterId: number): Promise<Master> {
        const result = await this.masterRepository.findOne({
            master_id: masterId
        });
        return result;
    }

    async save(createNewMasterInput: CreateNewMasterInput): Promise<Boolean> {
        await this.masterRepository.save(createNewMasterInput);
        return true;
    }

    async update(updateMasterInput: CreateNewMasterInput): Promise<Boolean> {
        const { master_id, school_year_id, master_name } = updateMasterInput;
        await this.masterRepository.update({ master_id: master_id }, { school_year_id, master_name });
        return true;
    }

    async createOrUpdateInstructions(createOrUpdateInstructions: CreateOrUpdateInstructions): Promise<Boolean> {
        const { master_id, instructions } = createOrUpdateInstructions;
        await this.masterRepository.update(
            { master_id },
            { instructions }
        )
        return true;
    }

    async deleteByMasterId(masterId: number): Promise<Boolean> {
        const master = await this.masterRepository.findOne({ master_id: masterId });
        await this.classesService.deleteByMasterId(masterId);
        await master.remove();
        return true;
    }
}
