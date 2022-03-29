import { ApplicationUserRegion } from '../models/user-region.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserRegionInput } from '../dto/create-user-region.input';
import { UpdateUserRegionInput } from '../dto/update-user-region.input';
import { getConnection, QueryRunner } from 'typeorm';
@Injectable()
export class UserRegionService {
  constructor(
    @InjectRepository(ApplicationUserRegion)
    private readonly userRegionRepository: Repository<ApplicationUserRegion>,
  ) {}

  async userRegionByRegionId(region_id: number): Promise<ApplicationUserRegion[]> {
    return await this.userRegionRepository.find({
      where: {
        region_id: region_id,
      },
      relations: ['regionDetail', 'user'],
    });
  }

  async findUserRegionByUserId(user_id: number): Promise<ApplicationUserRegion[]> {
    return await this.userRegionRepository.find({
      where: {
        user_id: user_id,
      },
      relations: ['regionDetail', 'user'],
    });
  }

  async getAllUserRegions(): Promise<ApplicationUserRegion[]> {
    return await this.userRegionRepository.find({
      relations: ['regionDetail', 'user'],
    });
  }

  async createUserRegion(
    createUserRegionInput: CreateUserRegionInput,
  ): Promise<ApplicationUserRegion[]> {
    try {
      await Promise.all(
        createUserRegionInput.region_id.map(async (id) => {
          const payload = {
            region_id: id,
            user_id: createUserRegionInput.user_id,
          };
          const data = this.userRegionRepository.create(payload);
          const inserted = await this.userRegionRepository.save(data);
        }),
      );
      return await this.findUserRegionByUserId(createUserRegionInput.user_id);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async removeUserRecords(records: [number], id: number): Promise<number> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    let deleteCount = 0;
    await Promise.all(
      records.map(async (_) => {
        const deletedRecord = await queryRunner.manager.delete(ApplicationUserRegion, {
          user_id: id,
        });
        deleteCount += deletedRecord.affected;
      }),
    );
    await queryRunner.release();
    return deleteCount;
  }

  async updateUserRegion(
    updateUserRegionInput: UpdateUserRegionInput,
  ): Promise<ApplicationUserRegion[]> {
    try {
      await this.removeUserRecords(
        updateUserRegionInput.region_id,
        updateUserRegionInput.user_id,
      );
      return await this.createUserRegion(updateUserRegionInput);
    } catch (error) {
      console.log(
        `🚀 ~ file: user-region.service.ts ~ line 64 ~ UserRegionService ~ updateUserRegion ~ error`,
        error,
      );
      throw new BadRequestException();
    }
  }

  async removeUserRegionById(region_id: number): Promise<String> {
    const data = await this.userRegionRepository.delete(region_id);
    if (data.affected > 0) {
      return 'User region has been removed';
    } else {
      return 'User region with this ID does not exist';
    }
  }
}
