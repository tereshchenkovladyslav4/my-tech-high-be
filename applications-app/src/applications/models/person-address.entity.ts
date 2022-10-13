import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { SchoolYear } from './schoolyear.entity';
import { Address } from './address.entity';

@ObjectType()
@Directive('@key(fields: "person_id, address_id")')
@Entity('mth_person_address')
export class PersonAddress extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  person_id?: number;

  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  address_id?: number;

  @OneToOne((type) => Address, (address) => address.address_id)
  @JoinColumn({ name: 'address_id', referencedColumnName: 'address_id' })
  address: Address;
}
