import { UpdateProfileInput } from './../dto/update-profile.inputs';
import { UpdateAccountInput } from '../dto/update-account.inputs';
import { BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, ID, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { AuthService } from '../../auth/service/auth.service';
import { AuthGuard } from '../../guards/auth.guard';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { MePermission } from '../../models/me-permission.entity';
import { User } from '../../models/user.entity';
import { UserPagination } from '../../models/user-pagination';
import { PersonInfo } from '../../models/person-info';
import { LoginInput } from '../dto/login.inputs';
import { AuthPayload } from '../dto/login.payload';
import { ParentUserService } from '../services/parent-user.service';
import { UsersService } from '../services/users.service';
import { ChangeStatusArgs } from './../dto/change-status.args';
import { CreateUserInput } from './../dto/create-user.input';
import { UpdateUserInput } from './../dto/update-user.input';
import { UserRegionArgs } from './../dto/user-regions.args';
import { UserAccessService } from './../services/access/user-access.service';
import { UserRegionService } from './../services/region/user-region.service';
import { UserRegion } from 'src/models/user-region.entity';
import { GetPersonInfoArgs } from '../dto/get-person-info.args';
import { Pagination } from '../paginate';
import { MasqueradeInput } from '../dto/masquerade-input';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private userRegionService: UserRegionService,
    private userAccessService: UserAccessService,
    private parentService: ParentUserService,
  ) {}

  @Query(() => User || null)
  @UseGuards(new AuthGuard())
  async me(@Context('user') user: any) {
    if (user) {
      return await this.usersService.findOneByEmail(user.username);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Query(() => Boolean)
  async emailTaken(@Args('email') email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  @Query(() => Number)
  async getUserIdFromEmail(@Args('email') email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      return user.user_id;
    } else {
      return 0;
    }
  }

  @Mutation(() => MePermission)
  @UseGuards(LocalAuthGuard)
  public async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthPayload | any> {
    const user = await this.authService.validateUser(loginInput.username, loginInput.password);
    const emailVerifier = await this.authService.getEmailVerification(loginInput.username);

    if (emailVerifier?.verified == 0) {
      return {
        unverified: true,
        jwt: '',
      };
    }

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    const token = await this.authService.login(user);
    const payload = {
      user_id: user.user_id,
      auth_token: token.jwt,
      last_login: new Date(),
    };
    await this.usersService.updateUser(payload);
    return token;
  }

  @Query(() => User, { name: 'user', nullable: true })
  @UseGuards(new AuthGuard())
  getUser(@Args({ name: 'user_id', type: () => ID }) user_id: number): Promise<User> {
    return this.usersService.findOneById(user_id);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(new AuthGuard())
  getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => [PersonInfo], { name: 'allPersonInfoBySearchItem' })
  @UseGuards(new AuthGuard())
  getAllPersonInfoBySearchItem(@Args('getPersonInfoArgs') getPersonInfoArgs: GetPersonInfoArgs): Promise<PersonInfo[]> {
    return this.usersService.findAllPersonInfoBySearchItem(getPersonInfoArgs);
  }

  @Query(() => UserPagination, { name: 'usersByRegions' })
  @UseGuards(new AuthGuard())
  getUserByRegions(@Args() userRegionArgs: UserRegionArgs): Promise<Pagination<User>> {
    if (userRegionArgs.filters.includes('Admin')) {
      return this.usersService.findUsersByRegions({
        ...userRegionArgs,
        filters: [...userRegionArgs.filters, 'Super Admin'],
      });
    } else {
      return this.usersService.findUsersByRegions(userRegionArgs);
    }
  }

  @Query(() => [User], { name: 'getTeacherListBySearchField' })
  @UseGuards(new AuthGuard())
  async getTeacherListBySearchField(
    @Args('searchPrimaryTeacher') searchPrimaryTeacher: GetPersonInfoArgs,
  ): Promise<User[]> {
    return this.usersService.getTeachersBySearch(searchPrimaryTeacher);
  }

  @UseGuards(new AuthGuard())
  @Mutation(() => User, { name: 'createUser' })
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    const isAdmin = await this.usersService.findOneById(createUserInput.creator_id);
    const canAddObserver = createUserInput.level === 14 && isAdmin.level === 2;
    if (canAddObserver || (await this.usersService.validateCreator(createUserInput.creator_id)) === true) {
      let parentUser = null;
      if (Number(createUserInput.level) === 13 || Number(createUserInput.level) === 14) {
        parentUser = await this.usersService.findOneByEmail(createUserInput.parent_email);
        if (!parentUser) {
          throw new BadRequestException('Parent Email does not exist');
        } else {
          if (parentUser.level !== 15) {
            throw new BadRequestException('Email address does not relate to any Parent.');
          }
        }
      }
      const response = await this.usersService.createUser(createUserInput);
      if (response) {
        if (Number(createUserInput.level) === 13 || Number(createUserInput.level) === 14) {
          const parentPayload = {
            child_id: response.user_id,
            parent_email: parentUser.email,
          };
          await this.parentService.createParent(parentPayload);
        }
        // const rolePayload = {
        //   user_id: response.user_id,
        //   role_id: createUserInput.level,
        //   creator_id: createUserInput.creator_id
        // }
        // await this.userRoleService.createRole(rolePayload);

        const accessPayload = {
          user_id: response.user_id,
          access_id: createUserInput.access,
          creator_id: createUserInput.creator_id,
        };
        this.userAccessService.createUserAccess(accessPayload);
      }
      return response;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(new AuthGuard())
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<User> {
    if ((await this.usersService.validateCreator(updateUserInput.creator_id)) === true) {
      const { creator_id, level, regions, access, parent_email, ...rest } = updateUserInput;
      let parentUser = null;
      if (Number(level) === 13 || Number(level) === 14) {
        parentUser = await this.usersService.findOneByEmail(parent_email);
        if (!parentUser) {
          throw new BadRequestException('Parent Email does not exist');
        } else {
          if (parentUser.level !== 15) {
            throw new BadRequestException('Email address does not relate to any Parent.');
          }
        }
      }
      const response = await this.usersService.updateUser(rest);
      if (response) {
        const regionCount = await this.userRegionService.findUserRegionByUserId(updateUserInput.user_id);
        if (regionCount.length !== regions.length) {
          const regionPayload = {
            user_id: response.user_id,
            region_id: regions,
            creator_id: creator_id,
          };
          await this.userRegionService.updateUserRegion(regionPayload);
        }
        const accessCount = await this.userAccessService.findUserAccessByUserId(updateUserInput.user_id);
        if (accessCount.length !== access.length) {
          const accessPayload = {
            user_id: response.user_id,
            access_id: access,
            creator_id: creator_id,
          };
          this.userAccessService.updateUserAccess(accessPayload);
        }
        if (Number(level) === 13 || Number(level) === 14) {
          const parentPayload = {
            child_id: response.user_id,
            parent_email: parentUser.email,
          };
          await this.parentService.createParent(parentPayload);
        }
        return response;
      } else {
        throw new BadRequestException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => User, { name: 'changeUserStatus' })
  @UseGuards(new AuthGuard())
  public async changeUserStatus(@Args() changeStatusArgs: ChangeStatusArgs): Promise<User> {
    if ((await this.usersService.validateCreator(changeStatusArgs.creator_id)) === true) {
      const response = await this.usersService.changeUserStatus(changeStatusArgs.user_id, changeStatusArgs.status);
      return response;
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => User, { name: 'updateProfile' })
  @UseGuards(new AuthGuard())
  async updateProfile(
    @Context('user') user: any,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ): Promise<User> {
    if (user) {
      const authUser = await this.usersService.findOneByEmail(user.username);
      if (!authUser) throw new UnauthorizedException();

      return await this.usersService.updateProfile(authUser, updateProfileInput);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => User, { name: 'updateAccount' })
  @UseGuards(new AuthGuard())
  async updateAccount(
    @Context('user') user: any,
    @Args('updateAccountInput') updateAccountInput: UpdateAccountInput,
  ): Promise<User> {
    if (user) {
      const authUser = await this.usersService.findOneByEmail(user.username);
      if (!authUser) throw new UnauthorizedException();

      return await this.usersService.updateAccount(authUser, updateAccountInput);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => User, { name: 'removeProfilePhoto' })
  @UseGuards(new AuthGuard())
  async removeProfilePhoto(@Context('user') user: any): Promise<User> {
    if (user) {
      const authUser = await this.usersService.findOneByEmail(user.username);
      if (!authUser) throw new UnauthorizedException();

      return await this.usersService.removeProfilePhoto(authUser);
    } else {
      throw new UnauthorizedException();
    }
  }

  @ResolveField(() => [UserRegion], { name: 'userRegions' })
  async getUserRegion(@Parent() user: User): Promise<UserRegion[]> {
    return await this.userRegionService.findUserRegionByUserId(user.user_id);
  }

  @Mutation(() => User, { name: 'toggleMasquerade' })
  @UseGuards(new AuthGuard())
  async toggleMasquerade(
    @Context('user') user: any,
    @Args('masqueradeInput') masqueradeInput: MasqueradeInput,
  ): Promise<User> {
    if (user) {
      const authUser = await this.usersService.findOneByEmail(user.username);
      if (!authUser) throw new UnauthorizedException();
      if (masqueradeInput.masquerade === true && authUser.level !== 1) throw new UnauthorizedException();

      const userToUpdate = await this.usersService.findOneById(masqueradeInput.user_id);
      if (!userToUpdate) throw new BadRequestException();

      if (userToUpdate.level !== 2) throw new UnauthorizedException();

      if (userToUpdate.level === 2) {
        return await this.usersService.toggleMasquerade(userToUpdate, masqueradeInput);
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(() => MePermission)
  @UseGuards(new AuthGuard())
  public async masqueradeUser(@Context('user') user: any, @Args('userId') userId: number): Promise<AuthPayload | any> {
    if (user) {
      const authUser = await this.usersService.findOneByEmail(user.username);
      if (!authUser || authUser.masquerade === 0) throw new UnauthorizedException();
      const masquerade = await this.usersService.findOneById(userId);
      const token = await this.authService.masquerade(masquerade, authUser);
      const payload = {
        user_id: masquerade.user_id,
        auth_token: token.jwt,
        last_login: new Date(),
      };
      await this.usersService.updateUser(payload);
      return token;
    } else {
      throw new UnauthorizedException();
    }
  }
}
