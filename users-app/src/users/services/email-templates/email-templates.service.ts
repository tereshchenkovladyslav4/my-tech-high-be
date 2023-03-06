import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from 'src/models/email-template.entity';
import { CreateEmailTemplateInput } from 'src/users/dto/emailTemplate/create-email-template.input';
import { EmailCategoryService } from './email-category.service';
import { EmailReminderService } from './email-reminder.service';
import { RegionService } from '../region/region.service';
@Injectable()
export class EmailTemplatesService {
  constructor(
    @InjectRepository(EmailTemplate)
    private readonly emailTemplateRepository: Repository<EmailTemplate>,
    private categoryService: EmailCategoryService,
    private emailReminderService: EmailReminderService,
    private regionService: RegionService,
  ) {}

  async findAll(): Promise<EmailTemplate[]> {
    const data = await this.emailTemplateRepository.find({
      relations: ['category', 'region'],
    });
    return data;

    /*if (regions.length > 0) {
      const response = await User.createQueryBuilder('users')
        .innerJoinAndSelect('users.userRegion', 'userRegion')
        .innerJoinAndSelect('users.role', 'role')
        .where('userRegion.region_id IN (:region_id)', { region_id: regions })
        .getMany();

      return response;
    } else {
      return [];
    }*/
  }

  async findByRegion(regionId: number, school_year_id?: number, mid_year?: boolean): Promise<EmailTemplate[]> {
    let templates: EmailTemplate[] = [];
    if (school_year_id) {
      templates = await this.emailTemplateRepository.find({
        where: { region_id: regionId, school_year_id: school_year_id, mid_year: mid_year },
        relations: ['category', 'region'],
      });
    } else {
      templates = await this.emailTemplateRepository.find({
        where: { region_id: regionId },
        relations: ['category', 'region'],
      });
    }

    // if there isn't templates that are matched to this school year, we have to create email templates about that school year.
    if (templates.length === 0) {
      const regionTemplates = await this.emailTemplateRepository.find({
        where: { region_id: regionId },
        relations: ['category', 'region'],
      });
      if (regionTemplates.length > 0) {
        await this.cloneWithMid(
          regionTemplates[0].school_year_id,
          school_year_id,
          regionTemplates[0].mid_year,
          mid_year,
          regionId,
        );
        templates = await this.emailTemplateRepository.find({
          where: { region_id: regionId, school_year_id: school_year_id, mid_year: mid_year },
          relations: ['category', 'region'],
        });
      }
    }

    return templates;
  }

  async findById(id: number): Promise<EmailTemplate> {
    const data = await this.emailTemplateRepository.findOne({
      where: { id },
      relations: ['category', 'region'],
    });
    return data;
  }

  async findByTemplate(template: string): Promise<EmailTemplate> {
    const data = await this.emailTemplateRepository.findOne({
      where: { template_name: template },
    });
    return data;
  }

  async findByTemplateAndRegion(
    template: string,
    regionId: number,
    schoolYearId?: number,
    midYear?: boolean,
  ): Promise<EmailTemplate> {
    if (schoolYearId) {
      const data = await this.emailTemplateRepository.findOne({
        where: { template_name: template, school_year_id: schoolYearId, mid_year: midYear, region_id: regionId },
      });
      return data;
    } else {
      const data = await this.emailTemplateRepository.findOne({
        where: { template_name: template, region_id: regionId },
      });
      return data;
    }
  }

  async getEmailTemplateByNameAndSchoolYearId(
    template_name: string,
    school_year_id: number,
    mid_year = false,
  ): Promise<EmailTemplate> {
    const data = await this.emailTemplateRepository.findOne({
      where: { template_name: template_name, school_year_id: school_year_id, mid_year: mid_year },
    });
    return data;
  }

  async createEmailTemplate(createEmailTemplateInput: CreateEmailTemplateInput): Promise<EmailTemplate> {
    const { emailTemplate, category } = createEmailTemplateInput;
    let categoryId = null;
    const emailCategory = await this.categoryService.findByName(category);
    if (emailCategory) {
      categoryId = emailCategory.category_id;
    } else {
      const emailCategory = await this.categoryService.create(category);
      categoryId = emailCategory.category_id;
    }
    return await this.emailTemplateRepository.save({
      ...emailTemplate,
      ...{
        category_id: categoryId,
      },
    });
  }

  async updateEmailTemplate(createEmailTemplateInput: CreateEmailTemplateInput): Promise<EmailTemplate> {
    const { emailTemplate, category } = createEmailTemplateInput;
    const reminders = emailTemplate?.reminders;
    const template = await this.findById(emailTemplate.id);
    delete emailTemplate.reminders;

    const deadline = emailTemplate?.deadline;
    delete emailTemplate.deadline;
    await this.emailTemplateRepository.update(template, emailTemplate);

    if (deadline) {
      await this.regionService.saveRegionDeadlines(template.region.id, deadline, category);
    }

    // remove old remider
    await this.emailReminderService.delete(emailTemplate.id);

    if (reminders && reminders.length > 0) {
      for (let index = 0; index < reminders.length; index++) {
        const remind = reminders[index];
        const payload = { ...remind, email_template_id: emailTemplate.id, id: 0 };
        await this.emailReminderService.create(payload);
      }
    }
    return template;
  }

  async clone(oldSchoolYearId: number, newSchoolYearId: number): Promise<boolean> {
    const oldTemplates = await this.emailTemplateRepository.find({ school_year_id: oldSchoolYearId });
    for (let i = 0; i < oldTemplates.length; i++) {
      const item = oldTemplates[i];
      const reminders = await this.emailReminderService.findByTemplateId(item['id']);
      delete item['id'];
      const newEmailTemplate = await this.emailTemplateRepository.save({
        ...item,
        school_year_id: newSchoolYearId,
      });
      for (let k = 0; k < reminders.length; k++) {
        const remiderItem = reminders[k];
        delete remiderItem['reminder_id'];
        await this.emailReminderService.create({ ...remiderItem, email_template_id: newEmailTemplate.id });
      }
    }
    return true;
  }

  async cloneWithMid(
    oldSchoolYearId: number,
    newSchoolYearId: number,
    oldMidYear: boolean,
    newMidYear: boolean,
    regionId: number,
  ): Promise<boolean> {
    const oldTemplates = await this.emailTemplateRepository.find({
      school_year_id: oldSchoolYearId,
      mid_year: oldMidYear,
      region_id: regionId,
    });
    for (let i = 0; i < oldTemplates.length; i++) {
      const item = oldTemplates[i];
      const reminders = await this.emailReminderService.findByTemplateId(item['id']);
      delete item['id'];
      const newEmailTemplate = await this.emailTemplateRepository.save({
        ...item,
        school_year_id: newSchoolYearId,
        mid_year: newMidYear,
      });
      for (let k = 0; k < reminders.length; k++) {
        const remiderItem = reminders[k];
        delete remiderItem['reminder_id'];
        await this.emailReminderService.create({ ...remiderItem, email_template_id: newEmailTemplate.id });
      }
    }
    return true;
  }
}
