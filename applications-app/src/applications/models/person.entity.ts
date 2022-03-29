import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EmailVerifier } from './email-verifier.entity';
import { PersonAddress } from './person-address.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "person_id, user_id")')
@Entity({ name: 'mth_person' })
export class Person extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  person_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  user_id?: number;

  @Column()
  first_name?: string;

  @Column()
  last_name?: string;

  @Column()
  middle_name?: string;

  @Column()
  preferred_first_name?: string;

  @Column()
  preferred_last_name?: string;

  @Column()
  gender?: string;

  @Column()
  email?: string;

  @Column()
  date_of_birth?: Date;

  @OneToOne((type) => EmailVerifier, (verifier) => verifier.user_id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  email_verifier: EmailVerifier;

  @OneToOne((type) => PersonAddress, (address) => address.person_id)
  @JoinColumn({ name: 'person_id', referencedColumnName: 'person_id' })
  person_address: PersonAddress;
}
