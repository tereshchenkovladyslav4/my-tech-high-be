import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { Person } from './person.entity';
import { Phone } from './phone.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "parent_id, person_id, notes")')
@Entity({ name: 'mth_parent' })
export class Parent extends BaseEntity {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  parent_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  person_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  notes?: string;

  @OneToOne((type) => Person)
  @JoinColumn({ name: 'person_id' })
  person?: Person;

  @Field((type) => Phone)
  phone?: Phone;
}
