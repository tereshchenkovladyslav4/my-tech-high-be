import { Role } from '../../models/role.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleInput } from '../dto/Role/create-role-input';
import { UpdateRoleInput } from '../dto/Role/update-role.input';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findRoleById(role_id: number): Promise<Role> {
    const data = await this.roleRepository.findOne({
      where: {
        id: role_id,
      },
      relations: ['role'],
    });
    return data;
  }

  getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async createRole(createRoleInput: CreateRoleInput): Promise<Role> {
    const data = this.roleRepository.create(createRoleInput);
    const updatedRecord = await this.roleRepository.save(data);
    return updatedRecord;
  }

  async updateRole(updateRoleInput: UpdateRoleInput): Promise<any> {
    const data = {
      name: updateRoleInput.name,
      level: updateRoleInput.level,
    };
    const res = await this.roleRepository.update(updateRoleInput.id, data);
    if (res.affected > 0) {
      return this.findRoleById(updateRoleInput.id);
    } else {
      throw new HttpException('There is an error updating record', 422);
    }
  }

  async removeRoleById(role_id: number): Promise<string> {
    const data = await this.roleRepository.delete(role_id);
    if (data.affected > 0) {
      return 'Role Removed';
    } else {
      return 'Role with this ID does not exist';
    }
  }
}
