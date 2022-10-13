import { Args, ID, Query, Resolver, ResolveReference, ResolveField, Parent as TypeParent } from '@nestjs/graphql';
import { Person } from '../models/person.entity';
import { PersonsArgs } from '../dto/persons.args';
import { PersonsService } from '../services/persons.service';
import { User } from '../models/user.entity';
import { UsersService } from '../services/users.service';
import { Parent } from '../models/parent.entity';
import { ParentsService } from '../services/parents.service';
import { Phone } from '../models/phone.entity';
import { PhonesService } from '../services/phones.service';

@Resolver((of) => Parent)
export class ParentsResolver {
  constructor(
    private personsService: PersonsService,
    private usersService: UsersService,
    private parentsService: ParentsService,
    private phonesService: PhonesService,
  ) {}

  @Query((returns) => Parent, { name: 'parent' })
  async getParent(@Args({ name: 'parent_id', type: () => ID }) parent_id: number): Promise<Parent> {
    return this.parentsService.findOneById(parent_id);
  }

  @ResolveField((of) => Person, { name: 'person' })
  public async getPerson(@TypeParent() parent: Parent): Promise<Person | any> {
    return (await this.personsService.findOneById(parent.person_id)) || {};
  }

  @ResolveField((of) => Phone, { name: 'phone' })
  public async getPhone(@TypeParent() parent: Parent): Promise<Phone | any> {
    return (await this.phonesService.findOneByPersonId(parent.person_id)) || {};
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; parent_id: number }): Promise<Parent> {
    return this.parentsService.findOneById(reference.parent_id);
  }
}
