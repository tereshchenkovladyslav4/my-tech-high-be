import { UpdateRegionInput } from '../../dto/region/update-region.input';
import { CreateRegionInput } from '../../dto/region/create-region.input';
import { Region } from '../../../models/region.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async findRegionById(region_id: number): Promise<Region> {
    const data = await this.regionRepository.findOne({
      where: {
        id: region_id,
      },
      relations: ['region'],
    });
    return data;
  }

  getAllRegions(): Promise<Region[]> {
    return this.regionRepository.find();
  }

  async createRegion(createRegionInput: CreateRegionInput): Promise<Region> {
    const data = this.regionRepository.create(createRegionInput);
    const updatedRecord = await this.regionRepository.save(data);
    return updatedRecord;
  }

  async updateRegion(updateRegionInput: UpdateRegionInput): Promise<any> {
    const data = {
      name: updateRegionInput.name,
      program: updateRegionInput.program,
    };
    const res = await this.regionRepository.update(updateRegionInput.id, data);
    if (res.affected > 0) {
      return this.findRegionById(updateRegionInput.id);
    } else {
      throw new HttpException('There is an error updating record', 422);
    }
  }

  async removeRegionById(region_id: number): Promise<String> {
    const data = await this.regionRepository.delete(region_id);
    if (data.affected > 0) {
      return 'Region Removed';
    } else {
      return 'Region with this ID does not exist';
    }
  }
}
