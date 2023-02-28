import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EmailTemplate } from 'src/models/email-template.entity';
import { EmailTemplatesService } from 'src/users/services/email-templates/email-templates.service';
import { CreateEmailTemplateInput } from 'src/users/dto/emailTemplate/create-email-template.input';

@Resolver(() => EmailTemplate)
export class EmailTemplateResolver {
  constructor(private emailTemplatesService: EmailTemplatesService) {}

  @Query(() => EmailTemplate, { name: 'emailTemplate', nullable: true })
  getEmailTemplate(@Args({ name: 'templateId', type: () => ID }) id: number): Promise<EmailTemplate> {
    return this.emailTemplatesService.findById(id);
  }

  @Query(() => EmailTemplate, { name: 'emailTemplateName', nullable: true })
  getEmailTemplateByName(
    @Args({ name: 'template', type: () => String }) template: string,
    @Args({ name: 'regionId', type: () => ID }) regionId: number,
    @Args({ name: 'schoolYearId', type: () => Number, nullable: true }) schoolYearId: number,
    @Args({ name: 'midYear', type: () => Boolean, nullable: true }) midYear: boolean,
  ): Promise<EmailTemplate> {
    return this.emailTemplatesService.findByTemplateAndRegion(template, regionId, schoolYearId, midYear);
  }

  @Query(() => EmailTemplate, { name: 'getEmailTemplateByNameAndSchoolYearId', nullable: true })
  getEmailTemplateByNameAndSchoolYearId(
    @Args({ name: 'template_name', type: () => String }) template_name: string,
    @Args({ name: 'school_year_id', type: () => Int }) school_year_id: number,
    @Args({ name: 'mid_year', type: () => Boolean }) mid_year: boolean,
  ): Promise<EmailTemplate> {
    return this.emailTemplatesService.getEmailTemplateByNameAndSchoolYearId(template_name, school_year_id, mid_year);
  }

  @Query(() => [EmailTemplate], { name: 'emailTemplatesByRegion' })
  getEmailTemplatesByRegion(
    @Args({ name: 'regionId', type: () => ID }) regionId: number,
    @Args({ name: 'school_year_id', type: () => Number, nullable: true }) school_year_id: number,
    @Args({ name: 'mid_year', type: () => Boolean, nullable: true }) mid_year: boolean,
  ): Promise<EmailTemplate[]> {
    return this.emailTemplatesService.findByRegion(regionId, school_year_id, mid_year);
  }

  @Mutation(() => EmailTemplate, { name: 'createEmailTemplate' })
  async createEmailTemplate(
    @Args('createEmailTemplateInput')
    createEmailTemplateInput: CreateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    return this.emailTemplatesService.createEmailTemplate(createEmailTemplateInput);
  }

  @Mutation(() => EmailTemplate, { name: 'updateEmailTemplate' })
  async updateEmailTemplate(
    @Args('createEmailTemplateInput')
    createEmailTemplateInput: CreateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    const response = await this.emailTemplatesService.updateEmailTemplate(createEmailTemplateInput);
    return response;
  }
}
