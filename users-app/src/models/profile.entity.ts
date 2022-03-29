import { Field, ObjectType } from '@nestjs/graphql';
import { Address } from './address.entity';
import { Person } from './person.entity';
import { Phone } from './phone.entity';

@ObjectType()
export class Profile {

  @Field((type) => Person)
  person?: Person

  @Field((type) => Phone)
  phone?: Phone
  
  @Field((type) => Address)
  address?: Address
}