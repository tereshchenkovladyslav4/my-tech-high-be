import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Title } from '../models/title.entity';
import { TitleService } from '../services/title.service';
import { CreateOrUpdateTitleInput } from '../dto/create-or-update-title.inputs';

@Resolver((of) => Title)
export class TitleResolver {
  constructor(private service: TitleService) {}

  @Mutation((returns) => Title, { name: 'createOrUpdateTitle' })
  @UseGuards(new AuthGuard())
  async createOrUpdateTitle(
    @Args('createTitleInput')
    createTitleInput: CreateOrUpdateTitleInput,
  ): Promise<Title> {
    return this.service.save(createTitleInput);
  }

  @Mutation((returns) => Boolean, { name: 'deleteTitle' })
  @UseGuards(new AuthGuard())
  async deleteTitle(
    @Args('titleId')
    titleId: number,
  ): Promise<boolean> {
    return this.service.delete(titleId);
  }

  @Mutation((returns) => Boolean, { name: 'cloneTitle' })
  @UseGuards(new AuthGuard())
  async cloneTitle(
    @Args('titleId')
    titleId: number,
  ): Promise<boolean> {
    return this.service.clone(titleId);
  }
}
