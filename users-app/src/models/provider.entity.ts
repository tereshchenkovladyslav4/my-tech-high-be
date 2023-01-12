import { Directive, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Period } from './period.entity';
import { Course } from './course.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "id, school_year_id, name, is_display, reduce_funds, price, reduce_funds_notification, multiple_periods, multi_periods_notification, allow_request, is_active, deleted, Courses, Periods, priority")',
)
@Entity({ name: 'mth_provider' })
export class Provider extends BaseEntity {
  @Column('int', { name: 'id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  id?: number;

  @Column('int', { name: 'school_year_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  school_year_id: number | null;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  name: string;

  @Column('tinyint', { name: 'is_display' })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  is_display: boolean;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  reduce_funds: string;

  @Column('decimal', {
    name: 'price',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  @Directive('@external')
  price: number | null;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  reduce_funds_notification: string;

  @Column('tinyint', { name: 'multiple_periods' })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  multiple_periods: boolean;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  multi_periods_notification: string;

  @Column('tinyint', { name: 'allow_request', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  allow_request: boolean;

  @Column('tinyint', { name: 'is_active', default: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  is_active: boolean;

  @Column('tinyint', { name: 'deleted', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  deleted: boolean;

  @Column('int', { name: 'priority', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  priority: number | null;

  @OneToMany(() => Course, (course) => course.Provider)
  @Field(() => [Course], { nullable: true })
  @Directive('@external')
  Courses: Course[];

  @ManyToMany(() => Period, (period) => period.Providers)
  @JoinTable({
    name: 'mth_provider_period',
    joinColumn: { name: 'provider_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'period_id', referencedColumnName: 'id' },
  })
  @Field(() => [Period], { nullable: true })
  @Directive('@external')
  Periods: Period[];
}
