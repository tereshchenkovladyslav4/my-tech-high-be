import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnrollmentQuestionGroup } from 'src/models/enrollment-question-group.entity';
import { Repository } from 'typeorm';
import { EnrollmentQuestionService } from './enrollment-question.service';

@Injectable()
export class EnrollmentQuestionGroupService {
  constructor(
    @InjectRepository(EnrollmentQuestionGroup)
    private readonly repo: Repository<EnrollmentQuestionGroup>,
    private enrollmentQuestionService: EnrollmentQuestionService,
  ) {}

  async cloneForSchoolYear(previoudTabId: number, newTabId: number): Promise<boolean> {
    const previousGroups = await this.repo.find({ tab_id: previoudTabId });
    for (let i = 0; i < previousGroups.length; i++) {
      const item = previousGroups[i];
      const previoudGroupId = item.id;
      delete item.id;
      const newGroup = await this.repo.save({
        ...item,
        tab_id: newTabId,
      });
      await this.enrollmentQuestionService.cloneForSchoolYear(previoudGroupId, newGroup.id);
    }
    return true;
  }
}
