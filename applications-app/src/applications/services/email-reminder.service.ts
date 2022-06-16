import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailReminder } from 'src/applications/models/email-reminder.entity';
import { EmailReminderInput } from 'src/applications/dto/create-email-reminder.input';
@Injectable()
export class EmailReminderService {
  constructor(
    @InjectRepository(EmailReminder)
    private readonly emailReminderRepository: Repository<EmailReminder>,
  ) {}

  async create(emailReminderInput: EmailReminderInput): Promise<EmailReminder> {
    return await this.emailReminderRepository.save(emailReminderInput);
  }

  async update(
    reminder_id: number,
    emailReminderInput: EmailReminderInput,
  ): Promise<any> {
    return await this.emailReminderRepository.update(
      reminder_id,
      emailReminderInput,
    );
  }

  async findByTemplateId(templateId: number): Promise<EmailReminder[]> {
    return await this.emailReminderRepository.find({
      email_template_id: templateId,
    });
  }

  async findByTemplateIdAndReminder(
    templateId: number,
    reminder: number,
  ): Promise<EmailReminder[]> {
    return await this.emailReminderRepository.find({
      email_template_id: templateId,
      reminder: reminder,
    });
  }
}
