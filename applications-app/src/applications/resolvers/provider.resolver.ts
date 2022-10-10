import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Provider } from '../models/provider.entity';
import { ProviderService } from '../services/provider.service';
import { FindProvidersInput } from '../dto/find-providers.input';
import { CreateOrUpdateProviderInput } from '../dto/create-or-update-provider.inputs';

@Resolver(() => Provider)
export class ProviderResolver {
  constructor(private service: ProviderService) {}

  @Query(() => [Provider], { name: 'providers' })
  @UseGuards(new AuthGuard())
  get(
    @Args('findProvidersInput')
    findProvidersInput: FindProvidersInput,
  ): Promise<Provider[]> {
    return this.service.find(findProvidersInput);
  }

  @Mutation(() => Provider, { name: 'createOrUpdateProvider' })
  @UseGuards(new AuthGuard())
  async createOrUpdateProvider(
    @Args('createProviderInput')
    createProviderInput: CreateOrUpdateProviderInput,
  ): Promise<Provider> {
    return this.service.save(createProviderInput);
  }

  @Mutation(() => Boolean, { name: 'deleteProvider' })
  @UseGuards(new AuthGuard())
  async deleteProvider(
    @Args('providerId')
    providerId: number,
  ): Promise<boolean> {
    return this.service.delete(providerId);
  }
}
