import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationEmailInput } from '../dto/new-application-email.inputs';
import { ApplicationEmail } from '../models/application-email.entity';
@Injectable()
export class ApplicationEmailsService {
  constructor(
    @InjectRepository(ApplicationEmail)
    private readonly applicationEmailsRepository: Repository<ApplicationEmail>,
  ) {}

  async findByApplication(application_id: number): Promise<ApplicationEmail[]> {
    return this.applicationEmailsRepository.find({
      where: { application_id: application_id },
      order: { created_at: 'ASC' },
    });
  }

  async findByOrder(): Promise<string> {
    return this.applicationEmailsRepository
      .createQueryBuilder('applicationEmail')
      .select()
      .orderBy('applicationEmail.created_at', 'DESC')
      .addGroupBy('applicationEmail.application_id')
      .getQuery();
  }

  async create(applicationEmail: CreateApplicationEmailInput): Promise<ApplicationEmail> {
    return this.applicationEmailsRepository.save(applicationEmail);
  }
}
