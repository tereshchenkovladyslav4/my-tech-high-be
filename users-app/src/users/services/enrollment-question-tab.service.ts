import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnrollmentQuestionTab } from 'src/models/enrollment-question-tab.entity';
import { Repository } from 'typeorm';
import { EnrollmentQuestionGroupService } from './enrollment-question-group.service';

@Injectable()
export class EnrollmentQuestionTabService {
  constructor(
    @InjectRepository(EnrollmentQuestionTab)
    private readonly repo: Repository<EnrollmentQuestionTab>,
    private enrollmentQuestionGroupService: EnrollmentQuestionGroupService,
  ) {}

  async cloneForSchoolYear(cloneSchoolYearId: number, newSchoolYearId: number): Promise<boolean> {
    const previousTab = await this.repo.find({ school_year_id: cloneSchoolYearId });
    for (let i = 0; i < previousTab.length; i++) {
      const item = previousTab[i];
      const previoudTabId = item.id;
      delete item.id;
      const newTab = await this.repo.save({
        ...item,
        school_year_id: newSchoolYearId,
      });
      await this.enrollmentQuestionGroupService.cloneForSchoolYear(previoudTabId, newTab.id);
    }
    return true;
  }
}
