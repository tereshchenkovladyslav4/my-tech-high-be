import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { Phone } from './phone.entity';
import { User } from './user.entity';
import { Address } from './address.entity';
import { PersonAddress } from './person-address.entity';

@ObjectType()
//@Directive('@extends')
@Directive('@key(fields: "person_id, user_id")')
@Entity({ name: 'mth_person' })
export class Person extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  //@Directive('@external')
  person_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  first_name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  last_name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  middle_name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  preferred_first_name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  preferred_last_name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  gender?: string;

  @Column()
  @Field(() => String, { nullable: true })
  email?: string;

  @Column()
  @Field(() => Date, { nullable: true })
  date_of_birth?: Date;

  @Column()
  @Field(() => String, { nullable: true })
  photo?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  user_id?: number;

  @Field((type) => Phone, { nullable: true })
  phone?: Phone;

  @Field((type) => Address, { nullable: true })
  address?: Address | null;

  @OneToOne((type) => PersonAddress, (address) => address.person_id)
  @JoinColumn({ name: 'person_id', referencedColumnName: 'person_id' })
  person_address: PersonAddress;

  @OneToOne((type) => User, (user) => user.user_id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: User;
}
