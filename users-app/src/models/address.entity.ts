import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "address_id")')
@Entity('mth_address')
export class Address extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
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
  country_id?: string;

  @Column()
  school_district?: string;
}
