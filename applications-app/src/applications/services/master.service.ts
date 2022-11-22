import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Master } from '../models/master.entity';
import { CreateNewMasterInput } from '../dto/create-new-master.input';

@Injectable()
export class MasterService {
    constructor(
        @InjectRepository(Master)
        private readonly masterRepository: Repository<Master>,
    ) { }

    async getAll(schoolYearId: number): Promise<Master[]> {
        const result = await this.masterRepository.find({
            school_year_id: schoolYearId
        });
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
}
