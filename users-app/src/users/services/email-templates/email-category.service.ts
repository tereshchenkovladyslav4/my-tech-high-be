import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplateCategory } from 'src/models/email-template-category.entity';
@Injectable()
export class EmailCategoryService {
  constructor(
    @InjectRepository(EmailTemplateCategory)
    private readonly emailCategoryRepository: Repository<EmailTemplateCategory>,
  ) {}

  async create(categoryName: string): Promise<EmailTemplateCategory> {
    return await this.emailCategoryRepository.save({
      category_name: categoryName,
    });
  }
  async findByName(category: string): Promise<EmailTemplateCategory> {
    return await this.emailCategoryRepository.findOne({
      where: { category_name: category },
    });
  }
}
