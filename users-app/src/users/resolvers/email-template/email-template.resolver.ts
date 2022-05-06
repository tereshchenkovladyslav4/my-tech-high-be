import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EmailTemplate } from 'src/models/email-template.entity';
import { EmailTemplatesService } from 'src/users/services/email-templates/email-templates.service';
import { CreateEmailTemplateInput } from 'src/users/dto/emailTemplate/create-email-template.input';

@Resolver((of) => EmailTemplate)
export class EmailTemplateResolver {
  constructor(private emailTemplatesService: EmailTemplatesService) {}

  @Query(() => EmailTemplate, { name: 'emailTemplate', nullable: true })
  getEmailTemplate(
    @Args({ name: 'templateId', type: () => ID }) id: number,
  ): Promise<EmailTemplate> {
    return this.emailTemplatesService.findById(id);
  }
  @Query(() => EmailTemplate, { name: 'emailTemplateName', nullable: true })
  getEmailTemplateByName(
    @Args({ name: 'template', type: () => String }) template: string,
  ): Promise<EmailTemplate> {
    return this.emailTemplatesService.findByTemplate(template);
  }
  @Query(() => [EmailTemplate], { name: 'emailTemplatesByRegion' })
  getEmailTemplatesByRegion(
    @Args({ name: 'regionId', type: () => ID }) regionId: number,
  ): Promise<EmailTemplate[]> {
    return this.emailTemplatesService.findByRegion(regionId);
  }

  @Mutation((of) => EmailTemplate, { name: 'createEmailTemplate' })
  async createEmailTemplate(
    @Args('createEmailTemplateInput')
    createEmailTemplateInput: CreateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    return this.emailTemplatesService.createEmailTemplate(
      createEmailTemplateInput,
    );
  }

  @Mutation((of) => EmailTemplate, { name: 'updateEmailTemplate' })
  async updateEmailTemplate(
    @Args('createEmailTemplateInput')
    createEmailTemplateInput: CreateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    const response = await this.emailTemplatesService.updateEmailTemplate(
      createEmailTemplateInput,
    );
    return response;
  }
}
