import { UnauthorizedException } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../../services/users.service';
import { UserRegion } from '../../../models/user-region.entity';
import { CreateUserRegionInput } from '../../dto/userRegion/create-user-region.input';
import { UpdateUserRegionInput } from '../../dto/userRegion/update-user-region.input';
import { UserRegionService } from '../../services/region/user-region.service';

@Resolver(() => UserRegion)
export class UserRegionResolver {
  constructor(private userRegionService: UserRegionService, private userService: UsersService) {}

  @Query(() => [UserRegion], { name: 'userRegionByRegionId', nullable: true })
  userRegionByRegionId(@Args({ name: 'region_id', type: () => ID }) region_id: number): Promise<UserRegion[]> {
    return this.userRegionService.userRegionByRegionId(region_id);
  }

  @Query(() => [UserRegion], { name: 'userRegionByUserId', nullable: true })
  findUserRegionByUserId(@Args({ name: 'user_id', type: () => ID }) user_id: number): Promise<UserRegion[]> {
    return this.userRegionService.findUserRegionByUserId(user_id);
  }

  @Query(() => [UserRegion], { name: 'userRegions' })
  getUserRegions(): Promise<UserRegion[]> {
    return this.userRegionService.getAllUserRegions();
  }

  // @UseGuards(new AuthGuard())
  @Mutation(() => [UserRegion], { name: 'createUserRegion' })
  async createUserRegion(
    @Args('createUserRegionInput') createUserRegionInput: CreateUserRegionInput,
  ): Promise<UserRegion[]> {
    if ((await this.userService.validateCreator(createUserRegionInput.creator_id)) === true) {
      const response = await this.userRegionService.createUserRegion(createUserRegionInput);
      return response;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => [UserRegion], { name: 'updateUserRegion' })
  async updateUserRegion(
    @Args('updateUserRegionInput') updateUserRegionInput: UpdateUserRegionInput,
  ): Promise<UserRegion[]> {
    const response = await this.userRegionService.updateUserRegion(updateUserRegionInput);
    return response;
  }

  @Mutation(() => String, { name: 'removeUserRegion' })
  public async removeUserRegion(@Args({ name: 'id', type: () => ID }) id: number): Promise<string> {
    const response = await this.userRegionService.removeUserRegionById(id);
    return response;
  }
}
