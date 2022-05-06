import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from 'src/models/email-template.entity';
import { CreateEmailTemplateInput } from 'src/users/dto/emailTemplate/create-email-template.input';
import { EmailCategoryService } from './email-category.service';
import { EmailReminderService } from './email-reminder.service';
@Injectable()
export class EmailTemplatesService {
  constructor(
    @InjectRepository(EmailTemplate)
    private readonly emailTemplateRepository: Repository<EmailTemplate>,
    private categoryService: EmailCategoryService,
    private emailReminderService: EmailReminderService,
  ) {}

  async findAll(): Promise<EmailTemplate[]> {
    const data = await this.emailTemplateRepository.find({
      relations: [
        'category'
      ]
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

  async findByRegion(regionId: number): Promise<EmailTemplate[]> {
    const data = await this.emailTemplateRepository.find({
      where: {region_id: regionId },
      relations: [
        'category'
      ]
    });
    return data;
  }

  async findById(id: number): Promise<EmailTemplate> {
    const data = await this.emailTemplateRepository.findOne(id);
    return data;
  }
  async findByTemplate(template: string): Promise<EmailTemplate> {
    const data = await this.emailTemplateRepository.findOne({
      where: { template_name: template },
    });
    return data;
  }
  async createEmailTemplate(
    createEmailTemplateInput: CreateEmailTemplateInput,
  ): Promise<EmailTemplate> {
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

  async updateEmailTemplate(
    createEmailTemplateInput: CreateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    const { emailTemplate, category } = createEmailTemplateInput;
    const reminders = emailTemplate?.reminders
    const template = await this.findById(emailTemplate.id);
    delete emailTemplate.reminders;
    await this.emailTemplateRepository.update(template, emailTemplate);

    if(reminders && reminders.length > 0) {
      reminders.forEach(async remind => {
       if(!remind.id) {
        const payload = { ...remind, email_template_id: emailTemplate.id}
        await this.emailReminderService.create(payload)
       } else {
        const { id } = remind
        delete remind.id
         await this.emailReminderService.update(id, remind);
       }
     })
    }
    return template;
  }
}
