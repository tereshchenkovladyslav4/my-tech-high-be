import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserAccess } from '../../../models/user-access.entity';
import { CreateUserAccessInput } from '../../dto/userAccess/create-user-access.input';
import { UpdateUserAccessInput } from '../../dto/userAccess/update-user-access.input';
import { UserAccessService } from '../../services/access/user-access.service';
import { UsersService } from '../../services/users.service';
import { AuthGuard } from './../../guards/auth.guard';

@Resolver(() => UserAccess)
export class UserAccessResolver {
  constructor(private userAccessService: UserAccessService, private userService: UsersService) {}

  @Query(() => [UserAccess], { name: 'userAccessByAccessId', nullable: true })
  @UseGuards(new AuthGuard())
  userAccessByAccessId(@Args({ name: 'access_id', type: () => ID }) access_id: number): Promise<UserAccess[]> {
    return this.userAccessService.userAccessByAccessId(access_id);
  }

  @Query(() => [UserAccess], { name: 'userAccessByUserId', nullable: true })
  @UseGuards(new AuthGuard())
  findUserAccessByUserId(@Args({ name: 'user_id', type: () => ID }) user_id: number): Promise<UserAccess[]> {
    return this.userAccessService.findUserAccessByUserId(user_id);
  }

  @Query(() => [UserAccess], { name: 'userAccesses' })
  @UseGuards(new AuthGuard())
  getUserAccesss(): Promise<UserAccess[]> {
    return this.userAccessService.getAllUserAccesss();
  }

  // @UseGuards(new AuthGuard())
  @Mutation(() => [UserAccess], { name: 'createUserAccess' })
  @UseGuards(new AuthGuard())
  async createUserAccess(
    @Args('createUserAccessInput') createUserAccessInput: CreateUserAccessInput,
  ): Promise<UserAccess[]> {
    if ((await this.userService.validateCreator(createUserAccessInput.creator_id)) === true) {
      const response = await this.userAccessService.createUserAccess(createUserAccessInput);
      return response;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => [UserAccess], { name: 'updateUserAccess' })
  @UseGuards(new AuthGuard())
  async updateUserAccess(
    @Args('updateUserAccessInput') updateUserAccessInput: UpdateUserAccessInput,
  ): Promise<UserAccess[]> {
    const response = await this.userAccessService.updateUserAccess(updateUserAccessInput);
    return response;
  }

  @Mutation(() => String, { name: 'removeUserAccess' })
  @UseGuards(new AuthGuard())
  public async removeUserAccess(@Args({ name: 'id', type: () => ID }) id: number): Promise<string> {
    const response = await this.userAccessService.removeUserAccessById(id);
    return response;
  }
}
