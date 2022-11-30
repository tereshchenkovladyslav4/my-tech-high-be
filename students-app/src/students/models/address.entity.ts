import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
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
  @Field(() => String, { nullable: true })
  name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  street?: string;

  @Column()
  @Field(() => String, { nullable: true })
  street2?: string;

  @Column()
  @Field(() => String, { nullable: true })
  city?: string;

  @Column()
  @Field(() => String, { nullable: true })
  state?: string;

  @Column()
  @Field(() => String, { nullable: true })
  zip?: string;

  @Column()
  @Field({ nullable: true })
  county_id?: number;

  @Column()
  @Field({ nullable: true })
  country_id?: string;

  @Column()
  @Field({ nullable: true })
  school_district?: string;
}
