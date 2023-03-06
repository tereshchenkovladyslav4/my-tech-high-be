import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'lodash';
import { SchoolPartner } from 'src/models/school-partner.entity';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { SchoolYear } from '../../models/schoolyear.entity';
import { CreateSchoolYearInput } from '../dto/schoolYear/create-schoolyear.input';
import { UpdateSchoolYearInput } from '../dto/schoolYear/update-schoolyear.input';
import { DiplomaService } from './diploma.service';
import { RegionService } from './region/region.service';
import { ScheduleBuilderService } from './schedule-builder.service';
import { SchoolPartnerService } from './school-partner.service';
import { AssessmentService } from './assessment.service';
import { ResourceService } from './resource.service';
import { SubjectService } from './subject.service';
import { TitleService } from './title.service';
import { ProviderService } from './provider.service';
import { CourseService } from './course.service';
import { PeriodService } from './period.service';
import { ApplicationQuestionService } from './application-question.service';
import { EnrollmentQuestionTabService } from './enrollment-question-tab.service';
import { QuestionService } from './question.service';
import { EmailTemplatesService } from './email-templates/email-templates.service';

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
    private subjectService: SubjectService,
    private titleService: TitleService,
    private providerService: ProviderService,
    private courseService: CourseService,
    private periodService: PeriodService,
    private applicationQuestionService: ApplicationQuestionService,
    private enrollmentQuestionTabService: EnrollmentQuestionTabService,
    private questionService: QuestionService,
    private emailTemplateService: EmailTemplatesService,
  ) {}

  findOneById(school_year_id: number): Promise<SchoolYear> {
    return this.schoolYearsRepository.findOne({
      where: {
        school_year_id: school_year_id,
      },
      relations: ['Region', 'ScheduleBuilder', 'Periods', 'ReimbursementSetting'],
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
      data.special_ed = cloneSchoolYear.special_ed;
      data.special_ed_options = cloneSchoolYear.special_ed_options;
      data.learning_logs = cloneSchoolYear.learning_logs;
      data.learning_logs_first_second_semesters = cloneSchoolYear.learning_logs_first_second_semesters;
      data.reimbursements = cloneSchoolYear.reimbursements;
      data.require_software = cloneSchoolYear.require_software;
      data.direct_orders = cloneSchoolYear.direct_orders;
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
      const periodIdMap = await this.periodService.cloneForSchoolYear(
        createSchoolYearInput.cloneSchoolYearId,
        newSchoolYearId,
      );
      const subjectIdMap = await this.subjectService.cloneForSchoolYear(
        createSchoolYearInput.cloneSchoolYearId,
        newSchoolYearId,
        periodIdMap,
      );

      const titleIdMap: { [key: number]: number } = {};
      const subjectIds = Object.keys(subjectIdMap);
      for (let index = 0; index < subjectIds.length; index++) {
        const cloneSubjectId = +subjectIds[index];
        const newSubjectId = subjectIdMap[cloneSubjectId];
        const idMap = await this.titleService.cloneForSubject(cloneSubjectId, newSubjectId);
        Object.assign(titleIdMap, titleIdMap, idMap);
      }

      const providerIdMap = await this.providerService.cloneForSchoolYear(
        createSchoolYearInput.cloneSchoolYearId,
        newSchoolYearId,
        periodIdMap,
      );

      const courseIdMap: { [key: number]: number } = {};
      const providerIds = Object.keys(providerIdMap);
      for (let index = 0; index < providerIds.length; index++) {
        const cloneProviderId = +providerIds[index];
        const newProviderId = providerIdMap[cloneProviderId];
        const idMap = await this.courseService.cloneForProvider(cloneProviderId, newProviderId, titleIdMap);
        Object.assign(courseIdMap, courseIdMap, idMap);
      }

      // clone application, enrollment questions
      await this.applicationQuestionService.cloneForSchoolYear(
        createSchoolYearInput.cloneSchoolYearId,
        newSchoolYearId,
      );
      await this.enrollmentQuestionTabService.cloneForSchoolYear(
        createSchoolYearInput.cloneSchoolYearId,
        newSchoolYearId,
      );

      // clone withdraw question
      await this.questionService.clone(createSchoolYearInput.cloneSchoolYearId, newSchoolYearId);

      // clone email template
      await this.emailTemplateService.clone(createSchoolYearInput.cloneSchoolYearId, newSchoolYearId);
    }
    return updatedRecord;
  }

  async updateSchoolYear(updateSchoolYearInput: UpdateSchoolYearInput): Promise<any> {
    const schoolYear = await this.schoolYearsRepository.findOne({
      where: {
        school_year_id: updateSchoolYearInput.school_year_id,
      },
    });
    if (updateSchoolYearInput.reimbursements && schoolYear.reimbursements != updateSchoolYearInput.reimbursements) {
      updateSchoolYearInput.reimbursement_open = null;
      updateSchoolYearInput.reimbursement_close = null;
      updateSchoolYearInput.mid_reimbursement_open = null;
      updateSchoolYearInput.mid_reimbursement_close = null;
    }
    if (updateSchoolYearInput.direct_orders && schoolYear.direct_orders != updateSchoolYearInput.direct_orders) {
      updateSchoolYearInput.direct_order_open = null;
      updateSchoolYearInput.direct_order_close = null;
      updateSchoolYearInput.mid_direct_order_open = null;
      updateSchoolYearInput.mid_direct_order_close = null;
    }
    const res = await this.schoolYearsRepository.save(updateSchoolYearInput);

    if (res) {
      return this.findOneById(updateSchoolYearInput.school_year_id);
    } else {
      throw new HttpException('There is an error updating record', 422);
    }
  }

  async deleteSchoolYear(school_year_id: number): Promise<boolean> {
    try {
      await this.schoolYearsRepository.delete({ school_year_id: school_year_id });
      return true;
    } catch (e) {
      return false;
    }
  }

  getCurrentSchoolYearByRegion(regionId: number): Promise<SchoolYear> {
    return this.schoolYearsRepository.findOne({
      where: {
        date_begin: LessThanOrEqual(new Date()),
        date_end: MoreThanOrEqual(new Date()),
        RegionId: regionId,
      },
    });
  }
}
