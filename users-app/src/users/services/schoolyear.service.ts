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

  findSchoolYearsByRegionId(region_id: number): Promise<SchoolYear[]> {
    return this.schoolYearsRepository.find({
      where: {
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
    let data = {};
    if (updateSchoolYearInput.date_begin) {
      data = { ...data, date_begin: updateSchoolYearInput.date_begin };
    }
    if (updateSchoolYearInput.date_end) {
      data = { ...data, date_end: updateSchoolYearInput.date_end };
    }
    if (updateSchoolYearInput.date_reg_open) {
      data = { ...data, date_reg_open: updateSchoolYearInput.date_reg_open };
    }
    if (updateSchoolYearInput.date_reg_close) {
      data = { ...data, date_reg_close: updateSchoolYearInput.date_reg_close };
    }
    if (updateSchoolYearInput.midyear_application) {
      data = {
        ...data,
        midyear_application: updateSchoolYearInput.midyear_application,
      };
    }
    if (updateSchoolYearInput.midyear_application_open) {
      data = {
        ...data,
        midyear_application_open:
          updateSchoolYearInput.midyear_application_open,
      };
    }
    if (updateSchoolYearInput.midyear_application_close) {
      data = {
        ...data,
        midyear_application_close:
          updateSchoolYearInput.midyear_application_close,
      };
    }
    if (updateSchoolYearInput.grades) {
      data = { ...data, grades: updateSchoolYearInput.grades };
    }
    if (updateSchoolYearInput.special_ed) {
      data = { ...data, special_ed: updateSchoolYearInput.special_ed };
    }
    if (updateSchoolYearInput.birth_date_cut) {
      data = { ...data, birth_date_cut: updateSchoolYearInput.birth_date_cut };
    }

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
