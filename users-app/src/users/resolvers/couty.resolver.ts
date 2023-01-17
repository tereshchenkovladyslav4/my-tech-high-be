import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { CountyService } from '../services/county.service';
import { County } from '../../models/county.entity';

@Resolver(() => County)
export class CountyResolver {
  constructor(private countyService: CountyService) {}

  @Query(() => [County], { name: 'getCounties', nullable: true })
  // @UseGuards(new AuthGuard())
  getCounties(@Args({ name: 'id', type: () => ID }) id: number): Promise<County[]> {
    return this.countyService.findCountiesById(id);
  }
}
