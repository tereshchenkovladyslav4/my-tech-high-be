import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, BaseEntity, PrimaryColumn } from 'typeorm';

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
}
