import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { QuickLink } from 'src/models/quick-link.entity';

@Injectable()
export class QuickLinkService {
  constructor(
    @InjectRepository(QuickLink)
    private readonly quickLinkRepository: Repository<QuickLink>,
  ) {}

  async findAll(): Promise<QuickLink[]> {
    const data = await this.quickLinkRepository.find({ where: { flag: Not(2) } });
    return data;
  }

  async findByRegion(regionId: number): Promise<QuickLink[]> {
    const data = await this.quickLinkRepository.find({
      where: { region_id: regionId, flag: Not(2) },
      order: { sequence: 'ASC' },
    });
    return data;
  }

  async findById(id: number): Promise<QuickLink> {
    const data = await this.quickLinkRepository.findOne(id);
    return data;
  }

  async createQuickLink(quickLink: QuickLink): Promise<QuickLink> {
    return await this.quickLinkRepository.save({
      ...quickLink,
    });
  }

  async updateQuickLink(quickLink: QuickLink): Promise<QuickLink> {
    await this.quickLinkRepository.update({ id: quickLink.id }, quickLink);
    return await this.findById(quickLink.id);
  }

  async removePhoto(id: number): Promise<QuickLink> {
    const data = await this.quickLinkRepository.findOne(id);
    return this.quickLinkRepository.save({
      ...data,
      image_url: '',
    });
  }
}
