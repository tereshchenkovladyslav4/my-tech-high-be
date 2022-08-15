import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'lodash';
import { SchoolPartner } from 'src/models/school-partner.entity';
import {
  Repository,
  LessThanOrEqual,
  MoreThanOrEqual,
  getConnection,
} from 'typeorm';
import { SchoolYear } from '../../models/schoolyear.entity';
import { CreateSchoolYearInput } from '../dto/schoolYear/create-schoolyear.input';
import { UpdateSchoolYearInput } from '../dto/schoolYear/update-schoolyear.input';
import { SchoolPartnerService } from './school-partner.service';
@Injectable()
export class SchoolYearsService {
  constructor(
    @InjectRepository(SchoolYear)
    private schoolYearsRepository: Repository<SchoolYear>,
    private schoolPartnerService: SchoolPartnerService,
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
      where: [
        {
          date_reg_open: LessThanOrEqual(new Date()),
          date_reg_close: MoreThanOrEqual(new Date()),
          RegionId: region_id,
        },
        {
          midyear_application_open: LessThanOrEqual(new Date()),
          midyear_application_close: MoreThanOrEqual(new Date()),
          RegionId: region_id,
          midyear_application: 1,
        },
      ],
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
    previousYearId?: number,
  ): Promise<SchoolYear> {
    const data = this.schoolYearsRepository.create(createSchoolYearInput);
    const updatedRecord = await this.schoolYearsRepository.save(data);

    let schoolPartnerList: SchoolPartner[] = [];
    if (previousYearId) {
      const prevYearPartners = await this.schoolPartnerService.findBySchoolYear(
        previousYearId,
      );
      map(prevYearPartners, async (partner) => {
        const { name, abbreviation, photo, region_id, active } = partner;

        if (active)
          await this.schoolPartnerService
            .createSchoolPartner({
              name,
              abbreviation,
              photo,
              region_id,
              school_year_id: updatedRecord.school_year_id,
            })
            .then((res) => schoolPartnerList.push(res));
      });
      updatedRecord.SchoolPartners = schoolPartnerList;
    }

    if (createSchoolYearInput.cloneSchoolYearId) {
      const newSchoolYearId = updatedRecord.school_year_id;

      const queryRunner = await getConnection().createQueryRunner();
      const resources = await queryRunner.query(
        `SELECT
          resource.*
        FROM infocenter.mth_resource_settings AS resource
        WHERE
          SchoolYearId = ${createSchoolYearInput.cloneSchoolYearId}`,
      );
      queryRunner.release();

      resources.map(async (resource) => {
        const queryRunner = await getConnection().createQueryRunner();
        const {
          title,
          image,
          subtitle,
          price,
          website,
          grades,
          std_user_name,
          std_password,
          detail,
          priority,
          is_active,
          resource_limit,
          add_resource_level,
          resource_level,
          family_resource,
        } = resource;
        await queryRunner.query(
          `INSERT INTO infocenter.mth_resource_settings
            (SchoolYearId, title, image, subtitle, price, website, grades, std_user_name, std_password, detail, priority, is_active, resource_limit, add_resource_level, resource_level, family_resource)
          VALUES
            (${newSchoolYearId}, "${title}", "${image}", "${subtitle}", ${price}, "${website}", "${grades}", "${std_user_name}", "${std_password}", "${detail}", ${priority}, ${is_active}, ${resource_limit}, ${add_resource_level}, "${resource_level}", ${family_resource});`,
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
