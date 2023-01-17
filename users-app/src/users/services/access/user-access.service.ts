import { UserAccess } from '../../../models/user-access.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserAccessInput } from '../../dto/userAccess/create-user-access.input';
import { UpdateUserAccessInput } from '../../dto/userAccess/update-user-access.input';

@Injectable()
export class UserAccessService {
  constructor(
    @InjectRepository(UserAccess)
    private readonly userAccessRepository: Repository<UserAccess>,
  ) {}

  async userAccessByAccessId(access_id: number): Promise<UserAccess[]> {
    return await this.userAccessRepository.find({
      where: {
        access_id: access_id,
      },
      relations: ['accessDetail', 'user'],
    });
  }

  async findUserAccessByUserId(user_id: number): Promise<UserAccess[]> {
    return await this.userAccessRepository.find({
      where: {
        user_id: user_id,
      },
      relations: ['accessDetail', 'user'],
    });
  }

  async getAllUserAccesss(): Promise<UserAccess[]> {
    return await this.userAccessRepository.find({
      relations: ['accessDetail', 'user'],
    });
  }

  async createUserAccess(createUserAccessInput: CreateUserAccessInput): Promise<UserAccess[]> {
    await Promise.all(
      createUserAccessInput.access_id.map(async (id) => {
        const payload = {
          access_id: id,
          user_id: createUserAccessInput.user_id,
        };
        const data = this.userAccessRepository.create(payload);
        await this.userAccessRepository.save(data);
      }),
    );
    return await this.findUserAccessByUserId(createUserAccessInput.user_id);
  }

  async updateUserAccess(updateUserAccessInput: UpdateUserAccessInput): Promise<UserAccess[]> {
    await Promise.all(
      updateUserAccessInput.access_id.map(async () => {
        await this.userAccessRepository.delete({ user_id: updateUserAccessInput.user_id });
      }),
    );
    await this.createUserAccess(updateUserAccessInput);
    return await this.findUserAccessByUserId(updateUserAccessInput.user_id);
  }

  async removeUserAccessById(access_id: number): Promise<string> {
    const data = await this.userAccessRepository.delete(access_id);
    if (data.affected > 0) {
      return 'User access has been removed';
    } else {
      return 'User access with this ID does not exist';
    }
  }
}
