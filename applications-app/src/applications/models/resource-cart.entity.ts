import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "student_id, resource_id, resource_level_id, waitlist_confirmed, created_at")')
@Directive('@extends')
@Entity('mth_resource_cart')
export class ResourceCart {
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  @Directive('@external')
  student_id?: number;

  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  @Directive('@external')
  resource_id?: number;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  @Directive('@external')
  resource_level_id?: number;

  @Column('tinyint', { name: 'waitlist_confirmed', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  waitlist_confirmed: boolean;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  created_at?: Date;
}
