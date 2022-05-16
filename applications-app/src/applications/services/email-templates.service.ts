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

  async findByTemplateAndRegion(
    template: string,
    regionId: number,
  ): Promise<ApplicationEmailTemplate> {
    const data = await this.emailTemplateRepository.findOne({
      where: { template_name: template, region_id: regionId },
    });
    return data;
  }

  async updateEmailTemplate(
    id: number,
    subject: string,
    body: string,
  ): Promise<ApplicationEmailTemplate> {
    return await this.emailTemplateRepository.save({ id, subject, body });
  }
}
