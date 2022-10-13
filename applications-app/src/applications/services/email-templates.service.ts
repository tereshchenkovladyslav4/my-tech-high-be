import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationEmailTemplate } from 'src/applications/models/email-template.entity';
@Injectable()
export class EmailTemplatesService {
  constructor(
    @InjectRepository(ApplicationEmailTemplate)
    private readonly emailTemplateRepository: Repository<ApplicationEmailTemplate>,
  ) {}

  async findAll(): Promise<ApplicationEmailTemplate[]> {
    const data = await this.emailTemplateRepository.find();
    return data;
  }
  async findById(id: number): Promise<ApplicationEmailTemplate> {
    const data = await this.emailTemplateRepository.findOne(id);
    return data;
  }
  async findByTemplate(template: string): Promise<ApplicationEmailTemplate> {
    const data = await this.emailTemplateRepository.findOne({
      where: { template_name: template },
    });
    return data;
  }

  async findAllByTemplate(template: string): Promise<ApplicationEmailTemplate[]> {
    const data = await this.emailTemplateRepository.find({
      where: { template_name: template },
    });
    return data;
  }

  async findByTemplateAndRegion(template: string, regionId: number): Promise<ApplicationEmailTemplate> {
    const data = await this.emailTemplateRepository.findOne({
      where: { template_name: template, region_id: regionId },
    });
    return data;
  }

  async updateEmailTemplate(
    id: number,
    from: string,
    subject: string,
    body: string,
  ): Promise<ApplicationEmailTemplate> {
    return await this.emailTemplateRepository.save({ id, from, subject, body });
  }

  async updateStandardResponses(id: number, standard_responses: string): Promise<ApplicationEmailTemplate> {
    return await this.emailTemplateRepository.save({ id, standard_responses });
  }
}
