import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/paginate';
import { Brackets, Repository } from 'typeorm';
import { ChecklistsArgs } from '../dto/checklist.args';
import { ChecklistInput } from '../dto/checklist.inputs';
import { Checklist } from '../models/checklist.entity';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(Checklist)
    private readonly checklistRepository: Repository<Checklist>,
  ) {}

  async findAll(checklistArgs: ChecklistsArgs): Promise<Pagination<Checklist>> {
    const { skip, take, filter, search, region_id } = checklistArgs;
    let newStatus = filter.status;

    if (filter.status.includes('both')) {
      const queryResult = await this.checklistRepository.query(
        `SELECT COUNT(*) as count, status FROM mth_checklist WHERE school_year_id=${filter.selectedYearId} AND region_id =${region_id} GROUP BY status`,
      );
      if (queryResult.length >= 2) {
        newStatus = ['Independent Checklist'];
      } else if (queryResult.length === 1) {
        newStatus = [queryResult[0].status];
      } else {
        newStatus = ['Independent Checklist'];
      }
    }
    const qb = this.checklistRepository
      .createQueryBuilder('checklist')
      .where(`checklist.region_id = ${region_id}`)
      .andWhere('checklist.status IN (:status)', { status: newStatus });

    if (filter && filter.selectedYearId) {
      qb.andWhere(`checklist.school_year_id = ${filter.selectedYearId}`);
    }
    if (search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .orWhere('checklist.checklist_id like :text', {
              text: `%${search}%`,
            })
            .orWhere('checklist.goal like :text', { text: `%${search}%` })
            .orWhere('checklist.subject like :text', {
              text: `%${search}%`,
            })
            .orWhere('checklist.grade like :text', { text: `%${search}%` });
        }),
      );
    }
    qb.orderBy('checklist.checklist_id', 'ASC');
    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();

    return new Pagination<Checklist>({
      results,
      total,
    });
  }

  async save(createNewChecklistInput: ChecklistInput[]): Promise<boolean> {
    let result = true;
    await this.checklistRepository.delete({
      region_id: createNewChecklistInput[0].region_id,
      school_year_id: createNewChecklistInput[0].school_year_id,
      status: createNewChecklistInput[0].status,
    });
    createNewChecklistInput.forEach(async (item) => {
      await this.checklistRepository.save(item).catch(() => (result = false));
    });
    return result;
  }

  async update(updateChecklistInput: ChecklistInput): Promise<boolean> {
    const { id, goal } = updateChecklistInput;
    await this.checklistRepository.update(id, { goal });
    return true;
  }
}
