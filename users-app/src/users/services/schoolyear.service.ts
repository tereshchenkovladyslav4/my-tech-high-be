import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { SchoolYear } from '../../models/schoolyear.entity';
import { CreateSchoolYearInput } from '../dto/schoolYear/create-schoolyear.input';
import { UpdateSchoolYearInput } from '../dto/schoolYear/update-schoolyear.input';
@Injectable()
export class SchoolYearsService {
  constructor(
    @InjectRepository(SchoolYear)
    private schoolYearsRepository: Repository<SchoolYear>,
  ) {}

  findOneById(school_year_id: number): Promise<SchoolYear> {
    return this.schoolYearsRepository.findOne({
      where: {
        school_year_id: school_year_id,
      },
      relations: ['Region'],
    });
  }

  findAll(): Promise<SchoolYear[]> {
    return this.schoolYearsRepository.find();
  }

  findActiveSchoolYears(region_id: number): Promise<SchoolYear[]> {
    return this.schoolYearsRepository.find({
      where: {
        date_reg_open: LessThanOrEqual(new Date()),
        date_reg_close: MoreThanOrEqual(new Date()),
        RegionId: region_id,
      },
    });
  }

  getCurrent(): Promise<SchoolYear> {
    return this.schoolYearsRepository.findOne({
      where: {
        date_begin: LessThanOrEqual(new Date()),
        date_end: MoreThanOrEqual(new Date()),
      },
    });
  }

  async createSchoolYear(
    createSchoolYearInput: CreateSchoolYearInput,
  ): Promise<SchoolYear> {
    const data = this.schoolYearsRepository.create(createSchoolYearInput);
    const updatedRecord = await this.schoolYearsRepository.save(data);
    return updatedRecord;
  }

  async updateSchoolYear(
    updateSchoolYearInput: UpdateSchoolYearInput,
  ): Promise<any> {
    const data = {
      date_begin: updateSchoolYearInput.date_begin,
      date_end: updateSchoolYearInput.date_end,
      date_reg_open: updateSchoolYearInput.date_reg_open,
      date_reg_close: updateSchoolYearInput.date_reg_close,
    };
    const res = await this.schoolYearsRepository.update(
      updateSchoolYearInput.school_year_id,
      data,
    );

    if (res.affected > 0) {
      return this.findOneById(updateSchoolYearInput.school_year_id);
    } else {
      throw new HttpException('There is an error updating record', 422);
    }
  }
}
