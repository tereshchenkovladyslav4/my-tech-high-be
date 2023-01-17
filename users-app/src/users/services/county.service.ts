import { County } from '../../models/county.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CountyService {
  constructor(
    @InjectRepository(County)
    private readonly countyRepository: Repository<County>,
  ) {}

  async findCountiesById(region_id: number): Promise<County[]> {
    const data = await this.countyRepository.find({
      where: {
        Region_id: region_id,
      },
    });
    return data;
  }
}
