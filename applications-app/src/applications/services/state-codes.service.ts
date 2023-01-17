import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/paginate';
import { Repository, Brackets } from 'typeorm';
import { StateCodesArgs } from '../dto/state-codes.args';
import { StateCodesInput } from '../dto/state-codes.input';
import { StateCodes } from '../models/state-codes.entity';
import { Title } from '../models/title.entity';

@Injectable()
export class StateCodesService {
  constructor(
    @InjectRepository(StateCodes)
    private readonly stateCodesRepository: Repository<StateCodes>,
  ) {}

  async save(stateCodesInput: StateCodesInput[]): Promise<boolean> {
    let result = true;
    stateCodesInput.forEach(async (item) => {
      await this.stateCodesRepository.save(item).catch(() => (result = false));
    });
    return result;
  }

  async update(updateStateCodesInput: StateCodesInput): Promise<boolean> {
    const { state_codes_id, state_code, teacher } = updateStateCodesInput;
    await this.stateCodesRepository.update(state_codes_id, { state_code, teacher });
    return true;
  }

  async findAll(stateCodesArgs: StateCodesArgs): Promise<Pagination<StateCodes>> {
    const { skip, take, search } = stateCodesArgs;
    const qb = this.stateCodesRepository
      .createQueryBuilder('stateCodes')
      .leftJoinAndMapOne('stateCodes.Title', Title, 'title', 'title.title_id = stateCodes.TitleId');

    if (search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .orWhere('stateCodes.teacher like :text', {
              text: `%${search}%`,
            })
            .orWhere('stateCodes.state_code like :text', { text: `%${search}%` })
            .orWhere('stateCodes.subject like :text', {
              text: `%${search}%`,
            })
            .orWhere('stateCodes.grade like :text', { text: `%${search}%` });
        }),
      );
    }

    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();
    return new Pagination<StateCodes>({
      results,
      total,
    });
  }
}
