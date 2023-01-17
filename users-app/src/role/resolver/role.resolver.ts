import { AuthGuard } from './../../users/guards/auth.guard';
import { UnauthorizedException, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRoleInput } from '../dto/Role/create-role-input';
import { UpdateRoleInput } from '../dto/Role/update-role.input';
import { Role } from './../../models/role.entity';
import { UsersService } from './../../users/services/users.service';
import { RoleService } from './../services/role-service';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private roleService: RoleService, private userService: UsersService) {}

  //  @UseGuards(new AuthGuard())
  @Query(() => Role, { name: 'role' })
  @UseGuards(new AuthGuard())
  public async findRoleById(@Args({ name: 'id', type: () => ID }) id: number): Promise<Role> {
    const res = await this.roleService.findRoleById(id);
    return res;
  }

  @Query(() => [Role], { name: 'roles' })
  @UseGuards(new AuthGuard())
  getAllRoles(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }
  // @UseGuards(new AuthGuard())
  @Mutation(() => Role, { name: 'createRole' })
  @UseGuards(new AuthGuard())
  async createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput): Promise<Role | any> {
    if ((await this.userService.validateCreator(createRoleInput.creator_id)) === true) {
      const response = await this.roleService.createRole(createRoleInput);
      return response;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => Role || String, { name: 'updateRole' })
  @UseGuards(new AuthGuard())
  @UsePipes(ValidationPipe)
  async updateRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput): Promise<string> {
    if ((await this.userService.validateCreator(updateRoleInput.creator_id)) === true) {
      return this.roleService.updateRole(updateRoleInput);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => String, { name: 'removeRole' })
  @UseGuards(new AuthGuard())
  public async removeRoleById(@Args({ name: 'id', type: () => ID }) id: number): Promise<string> {
    const response = await this.roleService.removeRoleById(id);
    return response;
  }
}
