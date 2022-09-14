import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'lodash';
import { SchoolPartner } from 'src/models/school-partner.entity';
import { Repository, LessThanOrEqual, MoreThanOrEqual, getConnection } from 'typeorm';
import { SchoolYear } from '../../models/schoolyear.entity';
import { CreateSchoolYearInput } from '../dto/schoolYear/create-schoolyear.input';
import { UpdateSchoolYearInput } from '../dto/schoolYear/update-schoolyear.input';
import { RegionService } from './region/region.service';
import { SchoolPartnerService } from './school-partner.service';
@Injectable()
export class SchoolYearsService {
  constructor(
    @InjectRepository(SchoolYear)
    private schoolYearsRepository: Repository<SchoolYear>,
    private schoolPartnerService: SchoolPartnerService,
    private regionService: RegionService,
  ) {}

  findOneById(school_year_id: number): Promise<SchoolYear> {
    return this.schoolYearsRepository.findOne({
      where: {
        school_year_id: school_year_id,
      },
      relations: ['Region', 'ScheduleBuilder'],
    });
  }

  findAll(): Promise<SchoolYear[]> {
    return this.schoolYearsRepository.find();
  }

  async findActiveSchoolYears(region_id: number): Promise<SchoolYear[]> {
    const nowDate = await this.regionService.getTimezoneDate(region_id);
    const result = await this.schoolYearsRepository.find({
      where: [
        {
          date_reg_open: LessThanOrEqual(nowDate),
          date_reg_close: MoreThanOrEqual(nowDate),
          RegionId: region_id,
        },
        {
          midyear_application_open: LessThanOrEqual(nowDate),
          midyear_application_close: MoreThanOrEqual(nowDate),
          RegionId: region_id,
          midyear_application: 1,
        },
      ],
    });

    result.map(
      (item) => (
        (item.MainyearApplicatable = item.date_reg_open <= nowDate && item.date_reg_close >= nowDate),
        (item.MidyearApplicatable =
          item.midyear_application &&
          item.midyear_application_open <= nowDate &&
          item.midyear_application_close >= nowDate)
      ),
    );
    return result;
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

  async createSchoolYear(createSchoolYearInput: CreateSchoolYearInput, previousYearId?: number): Promise<SchoolYear> {
    const data = this.schoolYearsRepository.create(createSchoolYearInput);

    if (createSchoolYearInput.cloneSchoolYearId) {
      // Clone grades
      const cloneSchoolYear = await this.schoolYearsRepository.findOne({
        where: {
          school_year_id: createSchoolYearInput.cloneSchoolYearId,
        },
      });
      if (cloneSchoolYear?.grades) data.grades = cloneSchoolYear.grades;
      data.enrollment_packet = false;
    }

    const updatedRecord = await this.schoolYearsRepository.save(data);

    let schoolPartnerList: SchoolPartner[] = [];
    if (previousYearId) {
      const prevYearPartners = await this.schoolPartnerService.findBySchoolYear(previousYearId);
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
      // Clone homeroom resources
      const newSchoolYearId = updatedRecord.school_year_id;

      const queryRunner = await getConnection().createQueryRunner();
      const resources = await queryRunner.query(
        `SELECT
          resource.*
        FROM infocenter.mth_resource_settings AS resource
        WHERE
          SchoolYearId = ${createSchoolYearInput.cloneSchoolYearId}
        ORDER BY resource_id ASC`,
      );
      const assessments = await queryRunner.query(
        `
          SELECT
            assessment.*
          FROM infocenter.mth_assessment AS assessment
          WHERE
            SchoolYearId = ${createSchoolYearInput.cloneSchoolYearId}
          ORDER BY assessment_id
        `,
      );

      for (let index = 0; index < resources.length; index++) {
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
          family_resource,
        } = resources[index];
        await queryRunner.query(
          `INSERT INTO infocenter.mth_resource_settings
            (SchoolYearId, title, image, subtitle, price, website, grades, std_user_name, std_password, detail, priority, is_active, resource_limit, add_resource_level, family_resource)
          VALUES
            (${newSchoolYearId}, "${title}", "${image}", "${subtitle}", ${price}, "${website}", "${grades}", "${std_user_name}", "${std_password}", "${detail}", ${priority}, ${is_active}, ${resource_limit}, ${add_resource_level}, ${family_resource});`,
        );
      }

      for (let index = 0; index < assessments.length; index++) {
        const { test_name, grades, information, priority, is_archived, option1, option_list } = assessments[index];
        await queryRunner.query(
          `INSERT INTO infocenter.mth_assessment
            (SchoolYearId, test_name, grades, information, priority, is_archived, option1, option_list)
          VALUES
            (${newSchoolYearId}, "${test_name}", "${grades}", "${information}", ${priority}, "${is_archived}", '${option1}', '${option_list}');`,
        );
      }
      queryRunner.release();
    }
    return updatedRecord;
  }

  async updateSchoolYear(updateSchoolYearInput: UpdateSchoolYearInput): Promise<any> {
    const res = await this.schoolYearsRepository.save(updateSchoolYearInput);

    if (res) {
      return this.findOneById(updateSchoolYearInput.school_year_id);
    } else {
      throw new HttpException('There is an error updating record', 422);
    }
  }
}
