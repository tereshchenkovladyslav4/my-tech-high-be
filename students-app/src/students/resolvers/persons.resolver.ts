import { Args, ID, Query, Resolver, ResolveReference, ResolveField, Parent } from '@nestjs/graphql';
import { Person } from '../models/person.entity';
import { PersonsArgs } from '../dto/persons.args';
import { PersonsService } from '../services/persons.service';
import { User } from '../models/user.entity';
import { UsersService } from '../services/users.service';
import { Phone } from '../models/phone.entity';
import { PhonesService } from '../services/phones.service';
import { Address } from '../models/address.entity';
import { AddressService } from '../services/address.service';
import { EmailVerifier } from '../models/email-verifier.entity';
import { EmailVerifiersService } from '../services/email-verifiers.service';

@Resolver((of) => Person)
export class PersonsResolver {
  constructor(
    private personsService: PersonsService,
    private usersService: UsersService,
    private phonesService: PhonesService,
    private addressService: AddressService,
    private emailVerifiersService: EmailVerifiersService,
  ) {}

  @Query((returns) => Person, { name: 'person' })
  async getPerson(@Args({ name: 'person_id', type: () => ID }) person_id: number): Promise<Person> {
    return await this.personsService.findOneById(person_id);
  }

  @Query((returns) => [Person], { name: 'persons' })
  async getPersons(@Args() personsArgs: PersonsArgs): Promise<Person[]> {
    return this.personsService.findAll(personsArgs);
  }

  @Query(() => Boolean)
  async studentEmailTaken(@Args('email') email: string) {
    const user = await this.personsService.findOneByEmail(email);
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  @ResolveField((of) => Phone, { name: 'phone' })
  async getPhone(@Parent() person: Person): Promise<Phone | any> {
    return (await this.phonesService.findOneByPersonId(person.person_id)) || {};
  }

  @ResolveField((of) => Address, { name: 'address' })
  async getAddress(@Parent() person: Person): Promise<Address | any> {
    return (await this.addressService.findOneByPersonId(person.person_id)) || {};
  }

  @ResolveField((of) => EmailVerifier, { name: 'email_verifier' })
  async getPersonEmailVerifier(@Parent() person: Person): Promise<EmailVerifier | any> {
    return (await this.emailVerifiersService.getPersonEmailVerifier(person.user_id)) || {};
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; person_id: number }): Promise<Person> {
    return this.personsService.findOneById(reference.person_id);
  }

  @ResolveField((of) => User, { name: 'user' })
  async getUser(@Parent() person: Person): Promise<User | any> {
    return (await this.usersService.findOneById(person.user_id)) || {};
  }
}
