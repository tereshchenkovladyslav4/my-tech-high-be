import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Address } from './address.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "person_id, address_id")')
@Entity('mth_person_address')
export class PersonAddress extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  @Directive('@external')
  person_id?: number;

  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  @Directive('@external')
  address_id?: number;

  @OneToOne((type) => Address, (address) => address.address_id)
  @JoinColumn({ name: 'address_id', referencedColumnName: 'address_id' })
  address: Address;
}
