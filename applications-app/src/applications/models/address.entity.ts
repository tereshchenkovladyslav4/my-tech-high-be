import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "address_id")')
@Entity('mth_address')
export class Address extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  address_id?: number;

  @Column()
  name?: string;

  @Column()
  street?: string;

  @Column()
  street2?: string;

  @Column()
  city?: string;

  @Column()
  state?: string;

  @Column()
  zip?: string;

  @Column()
  county_id?: number;

  @Column()
  school_district?: string;
}
