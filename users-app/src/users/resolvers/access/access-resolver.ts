import { AuthGuard } from './../../guards/auth.guard';
import { HttpException, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../..//services/users.service';
import { Access } from '../../../models/access.entity';
import { CreateAccessInput } from '../../dto/access/create-access.input';
import { UpdateAccessInput } from '../../dto/access/update-access.input';
import { AccessService } from '../../services/access/access.service';

@Resolver(() => Access)
export class AccessResolver {
  constructor(private accessService: AccessService, private userService: UsersService) {}

  @Query(() => Access, { name: 'access', nullable: true })
  @UseGuards(new AuthGuard())
  getAccess(@Args({ name: 'id', type: () => ID }) id: number): Promise<Access> {
    return this.accessService.findAccessById(id);
  }

  @Query(() => [Access], { name: 'getAllAccesses' })
  @UseGuards(new AuthGuard())
  getAccesss(): Promise<Access[]> {
    return this.accessService.getAllAccesses();
  }

  // @UseGuards(new AuthGuard())
  @Mutation(() => Access, { name: 'createAccess' })
  @UseGuards(new AuthGuard())
  async createAccess(@Args('createAccessInput') createAccessInput: CreateAccessInput): Promise<Access> {
    if ((await this.userService.validateCreator(createAccessInput.creator_id)) === true) {
      const response = await this.accessService.createAccess(createAccessInput);
      return response;
    } else {
      throw new HttpException("You're not authorised to add access.", 401);
    }
  }

  @Mutation(() => Access, { name: 'updateAccess' })
  @UseGuards(new AuthGuard())
  async updateAccess(@Args('updateAccessInput') updateAccessInput: UpdateAccessInput): Promise<Access> {
    const response = await this.accessService.updateAccess(updateAccessInput);
    return response;
  }

  @Mutation(() => String, { name: 'removeAccess' })
  @UseGuards(new AuthGuard())
  public async removeAccess(@Args({ name: 'id', type: () => ID }) id: number): Promise<string> {
    const response = await this.accessService.removeAccessById(id);
    return response;
  }
}
