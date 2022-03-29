import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Person } from './person.entity';
import { Phone } from './phone.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "parent_id, person_id")')
@Entity({ name: 'mth_parent'})
export class Parent extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  parent_id?: number

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  person_id?: number

  @Field((type) => Person)
  person?: Person

  @Field((type) => Phone)
  phone?: Phone
}
