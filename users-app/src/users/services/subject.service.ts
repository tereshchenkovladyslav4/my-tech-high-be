import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../../models/subject.entity';
import { PeriodService } from './period.service';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly repo: Repository<Subject>,
    private periodService: PeriodService,
  ) {}

  async cloneForSchoolYear(
    cloneSchoolYearId: number,
    newSchoolYearId: number,
    periodIdMap: { [key: number]: number },
  ): Promise<{ [key: number]: number }> {
    const subjects = await this.repo.find({ where: { SchoolYearId: cloneSchoolYearId }, relations: ['Periods'] });
    const idMap: { [key: number]: number } = {};
    for (let index = 0; index < subjects.length; index++) {
      const subject = subjects[index];
      const subjectId = subject.subject_id;

      delete subject.subject_id;
      delete subject.SchoolYearId;

      const periodIds = subject.Periods.map((x) => periodIdMap[x.id]);
      const periods = await this.periodService.findByIds(periodIds);

      const result = await this.repo.save({
        ...subject,
        SchoolYearId: newSchoolYearId,
        Periods: periods,
      });
      idMap[subjectId] = result.subject_id;
    }
    return idMap;
  }
}
