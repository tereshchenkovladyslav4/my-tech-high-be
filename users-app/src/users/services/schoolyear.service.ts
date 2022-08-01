import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  LessThanOrEqual,
  MoreThanOrEqual,
  getConnection,
} from 'typeorm';
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
    if (createSchoolYearInput.cloneSchoolYearId) {
      const newSchoolYearId = updatedRecord.school_year_id;

      const queryRunner = await getConnection().createQueryRunner();
      const resources = await queryRunner.query(
        `SELECT
          resource.*
        FROM infocenter.mth_resource AS resource
        WHERE
          SchoolYearId = ${createSchoolYearInput.cloneSchoolYearId}`,
      );
      queryRunner.release();

      resources.map(async (resource) => {
        const queryRunner = await getConnection().createQueryRunner();
        const {
          title,
          show_cost,
          cost,
          image,
          sequence,
          website,
          hidden,
          allow_request,
        } = resource;
        await queryRunner.query(
          `INSERT INTO infocenter.mth_resource
            (SchoolYearId, title, show_cost, cost, image, sequence, website, hidden, allow_request)
          VALUES
            (${newSchoolYearId}, "${title}", ${show_cost}, ${cost}, "${image}", ${sequence}, "${website}", ${hidden}, ${allow_request});`,
        );
        queryRunner.release();
      });
    }
    return updatedRecord;
  }

  async updateSchoolYear(
    updateSchoolYearInput: UpdateSchoolYearInput,
  ): Promise<any> {
    const res = await this.schoolYearsRepository.save(updateSchoolYearInput);

    if (res) {
      return this.findOneById(updateSchoolYearInput.school_year_id);
    } else {
      throw new HttpException('There is an error updating record', 422);
    }
  }
}
