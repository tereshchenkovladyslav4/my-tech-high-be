import { UserRegion } from './../models/user-region.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRegionService {
  constructor(
    @InjectRepository(UserRegion)
    private readonly userRegionRepository: Repository<UserRegion>,
  ) {}

  async userRegionByRegionId(region_id: number): Promise<UserRegion[]> {
    return await this.userRegionRepository.find({
      where: {
        region_id: region_id,
      },
      relations: ['regionDetail', 'user'],
    });
  }

  async findUserRegionByUserId(user_id: number): Promise<UserRegion[]> {
    return await this.userRegionRepository.find({
      where: {
        user_id: user_id,
      },
      relations: ['regionDetail', 'user'],
    });
  }

  async getAllUserRegions(): Promise<UserRegion[]> {
    return await this.userRegionRepository.find({
      relations: ['regionDetail', 'user'],
    });
  }

  async removeUserRegionById(region_id: number): Promise<string> {
    const data = await this.userRegionRepository.delete(region_id);
    if (data.affected > 0) {
      return 'User region has been removed';
    } else {
      return 'User region with this ID does not exist';
    }
  }
}
