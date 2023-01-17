import { Args, Resolver, ResolveField, Parent as TypeParent, Mutation } from '@nestjs/graphql';
import { Person } from '../models/person.entity';
import { PersonsService } from '../services/persons.service';
import { Observer } from '../models/observer.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ObserverInput } from '../dto/observer.inputs';
import { ObserversService } from '../services/observers.service';
@Resolver(() => Observer)
export class ObserversResolver {
  constructor(private personsService: PersonsService, private observerService: ObserversService) {}

  @ResolveField(() => Person, { name: 'person' })
  public async getPerson(@TypeParent() observer: Observer): Promise<Person> {
    return this.personsService.findOneById(observer.person_id);
  }

  @Mutation(() => [Observer], { name: 'createObserver' })
  @UseGuards(new AuthGuard())
  async addApplication(
    @Args('observerInput')
    observerInput: ObserverInput,
  ): Promise<Observer[]> {
    return await this.observerService.create(observerInput);
  }
}
