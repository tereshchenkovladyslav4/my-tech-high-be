import { Field, ObjectType } from '@nestjs/graphql';
import { Address } from './address.entity';
import { Person } from './person.entity';
import { Phone } from './phone.entity';

@ObjectType()
export class Profile {
  @Field(() => Person)
  person?: Person;

  @Field(() => Phone)
  phone?: Phone;

  @Field(() => Address)
  address?: Address;
}
