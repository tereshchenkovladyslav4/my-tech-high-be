import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Provider } from '../models/provider.entity';
import { ProviderService } from '../services/provider.service';

@Resolver(() => Provider)
export class ProviderResolver {
  constructor(private service: ProviderService) {}

  @Query(() => [Provider], { name: 'studentProviders' })
  @UseGuards(new AuthGuard())
  get(@Args({ name: 'schoolYearId', type: () => ID }) schoolYearId: number): Promise<Provider[]> {
    return this.service.find(schoolYearId);
  }
}
