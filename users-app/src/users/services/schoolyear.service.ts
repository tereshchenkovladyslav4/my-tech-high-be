import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'lodash';
import { ScheduleBuilder } from 'src/models/scheduler-builder.entity';
import { SchoolPartner } from 'src/models/school-partner.entity';
import { Repository, LessThanOrEqual, MoreThanOrEqual, getConnection } from 'typeorm';
import { SchoolYear } from '../../models/schoolyear.entity';
import { CreateSchoolYearInput } from '../dto/schoolYear/create-schoolyear.input';
import { UpdateSchoolYearInput } from '../dto/schoolYear/update-schoolyear.input';
import { DiplomaService } from './diploma.service';
import { RegionService } from './region/region.service';
import { ScheduleBuilderService } from './schedule-builder.service';
import { SchoolPartnerService } from './school-partner.service';
import { AssessmentService } from './assessment.service';
import { ResourceService } from './resource.service';

@Injectable()
export class SchoolYearsService {
  constructor(
    @InjectRepository(SchoolYear)
    private schoolYearsRepository: Repository<SchoolYear>,
    private schoolPartnerService: SchoolPartnerService,
    private scheduleBuilderService: ScheduleBuilderService,
    private regionService: RegionService,
    private diplomaService: DiplomaService,
    private assessmentService: AssessmentService,
    private resourceService: ResourceService,
  ) {}

  findOneById(school_year_id: number): Promise<SchoolYear> {
    return this.schoolYearsRepository.findOne({
      where: {
        school_year_id: school_year_id,
      },
      relations: ['Region', 'ScheduleBuilder', 'Periods'],
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
      const cloneSchoolYear: SchoolYear = await this.schoolYearsRepository.findOne({
        where: {
          school_year_id: createSchoolYearInput.cloneSchoolYearId,
        },
      });
      // Clone grades
      if (cloneSchoolYear?.grades) data.grades = cloneSchoolYear.grades;
      data.enrollment_packet = false;
    }

    const updatedRecord = await this.schoolYearsRepository.save(data);

    const previousScheduleBuilder = await this.scheduleBuilderService.findOneById(
      createSchoolYearInput.cloneSchoolYearId,
    );
    if (previousScheduleBuilder) {
      await this.scheduleBuilderService.createOrUpdate({
        max_num_periods: previousScheduleBuilder.max_num_periods,
        custom_built: previousScheduleBuilder.custom_built,
        always_unlock: previousScheduleBuilder.always_unlock,
        parent_tooltip: previousScheduleBuilder.parent_tooltip,
        third_party_provider: previousScheduleBuilder.third_party_provider,
        split_enrollment: previousScheduleBuilder.split_enrollment,
        school_year_id: updatedRecord.school_year_id,
      });
    }

    const schoolPartnerList: SchoolPartner[] = [];
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
      // Clone homeroom resources, assessments, diploma question...
      const newSchoolYearId = updatedRecord.school_year_id;
      await this.resourceService.cloneForSchoolYear(createSchoolYearInput.cloneSchoolYearId, newSchoolYearId);
      await this.assessmentService.cloneForSchoolYear(createSchoolYearInput.cloneSchoolYearId, newSchoolYearId);
      await this.diplomaService.cloneDiplomaQuestion(createSchoolYearInput.cloneSchoolYearId, newSchoolYearId);
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
