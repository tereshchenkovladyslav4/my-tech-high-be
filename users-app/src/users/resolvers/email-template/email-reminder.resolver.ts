import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { EmailReminder } from 'src/models/email-reminder.entity';
import { EmailReminderService } from 'src/users/services/email-templates/email-reminder.service';

@Resolver(() => EmailReminder)
export class EmailReminderResolver {
  constructor(private emailReminderService: EmailReminderService) {}

  @Query(() => [EmailReminder], { name: 'remindersByTemplateId', nullable: true })
  getEmailRemindersByTemplateId(
    @Args({ name: 'templateId', type: () => ID }) templateId: number,
  ): Promise<EmailReminder[]> {
    return this.emailReminderService.findByTemplateId(templateId);
  }
}
