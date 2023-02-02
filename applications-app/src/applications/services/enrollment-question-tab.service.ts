import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentQuestionTab } from '../models/enrollment-question-tab.entity';
import { EnrollmentQuestionsInput } from '../dto/enrollment-question.input';
import { NewEnrollmentQuestionTabInput } from '../dto/new-enrollment-question-tab.inputs';
import { EnrollmentQuestionGroupService } from './enrollment-question-group.service';
import { EmailTemplatesService } from './email-templates.service';
import { EmailTemplateEnum } from '../enums';

@Injectable()
export class EnrollmentQuestionTabService {
  constructor(
    @InjectRepository(EnrollmentQuestionTab)
    private readonly repo: Repository<EnrollmentQuestionTab>,
    private enrollmentQuestionGroupService: EnrollmentQuestionGroupService,
    private emailTemplateService: EmailTemplatesService,
  ) {}

  async find(input?: EnrollmentQuestionsInput): Promise<EnrollmentQuestionTab[]> {
    if (input) {
      const result = this.repo
        .createQueryBuilder('tabs')
        .leftJoinAndSelect('mth_enrollment_question_group', 'groups', 'groups.tab_id = tabs.id')
        .where(`tabs.region_id = "${input.region_id}"`)
        .where(`groups.school_year_id = "${input.school_year_id}"`)
        .getMany();
      return result;
    }
    return await this.repo.find();
  }

  async findByActive(input?: EnrollmentQuestionsInput): Promise<EnrollmentQuestionTab[]> {
    if (input) {
      return this.repo
        .createQueryBuilder('tabs')
        .leftJoinAndSelect('mth_enrollment_question_group', 'groups', 'groups.tab_id = tabs.id')
        .where(`tabs.is_active = 1`)
        .where(`tabs.region_id = "${input.region_id}"`)
        .where(`groups.school_year_id = "${input.school_year_id}"`)
        .getMany();
    }
    return await this.repo.find();
  }

  async findByAdmin(input?: EnrollmentQuestionsInput): Promise<EnrollmentQuestionTab[]> {
    if (input) {
      return await this.repo.find({
        where: {
          region_id: input.region_id,
          is_active: 1,
        },
      });
    }
    return await this.repo.find();
  }

  async createOrUpdate(input: NewEnrollmentQuestionTabInput): Promise<EnrollmentQuestionTab> {
    const { id, is_active, tab_name, region_id, groups, school_year_id } = input;
    const tabData = await this.repo.save({
      id,
      is_active,
      tab_name,
      region_id,
    });
    Promise.all(
      groups.map(
        async (el) =>
          await this.enrollmentQuestionGroupService.createOrUpdate({
            ...el,
            tab_id: tabData.id,
            school_year_id: school_year_id,
          }),
      ),
    );

    //  Update the standard responses of Missing Info email template
    if (tab_name == 'Documents') {
      const template = await this.emailTemplateService.findByTemplateAndRegion(
        EmailTemplateEnum.MISSING_INFORMATION,
        region_id,
      );
      if (template.standard_responses != '') {
        const oldresponses = JSON.parse(template.standard_responses);

        if (groups.length) {
          const newresponses = [];
          groups[0].questions.forEach((group) => {
            const response = oldresponses.find((x) => x.id == group.id);
            if (response != null) {
              newresponses.push(response);
            }
          });
          const tmp = JSON.stringify(newresponses);
          if (tmp != template.standard_responses) {
            await this.emailTemplateService.updateStandardResponses(template.id, tmp);
          }
        }
      }
    }

    return tabData;
  }
  async deleteEnrollment(id: number): Promise<number> {
    const res = await this.repo.delete(id);
    return res.affected;
  }
}
