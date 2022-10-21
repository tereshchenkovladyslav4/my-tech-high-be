import { SchoolDistrict } from '../../models/school-district.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SchoolDistrictService {
  constructor(
    @InjectRepository(SchoolDistrict)
    private readonly schoolDistrictRepository: Repository<SchoolDistrict>,
  ) {}

  async findSchoolDistrictsById(region_id: number): Promise<SchoolDistrict[]> {
    const data = await this.schoolDistrictRepository.find({
      where: {
        Region_id: region_id,
      },
    });
    return data;
  }
}
