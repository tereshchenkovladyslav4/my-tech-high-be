import { Directive, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ResourceSubtitle } from '../enums';
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive('@key(fields: "resource_id")')
@Entity({ name: 'mth_resource_settings' })
export class Resource extends BaseEntity {
  @Column('int', { name: 'resource_id', nullable: true })
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  resource_id?: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  SchoolYearId: number | null;

  @Column()
  @Field(() => String, { nullable: true })
  title: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  image: string;

  @Column()
  @Field(() => String, { nullable: true })
  @IsIn([
    ResourceSubtitle.NONE,
    ResourceSubtitle.INCLUDED,
    ResourceSubtitle.PRICE,
  ])
  subtitle: string;

  @Column('decimal', {
    name: 'price',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  price: number | null;

  @Column('varchar', { length: 100, nullable: true })
  @Field(() => String, { nullable: true })
  website: string;

  @Column()
  @Field(() => String, { nullable: true })
  grades: string;

  @Column()
  @Field(() => String, { nullable: true })
  std_user_name: string;

  @Column()
  @Field(() => String, { nullable: true })
  std_password: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  detail: string;

  @Column('int', { name: 'priority', nullable: true })
  @Field(() => Int, { nullable: true })
  priority: number | null;

  @Column('tinyint', { name: 'is_active', default: true })
  @Field(() => Boolean, { nullable: true })
  is_active: boolean;

  @Column('int', { name: 'resource_limit', nullable: true })
  @Field(() => Int, { nullable: true })
  resource_limit: number | null;

  @Column('tinyint', { name: 'add_resource_level', nullable: true })
  @Field(() => Boolean, { nullable: true })
  add_resource_level: boolean;

  @Column({ name: 'resource_level', nullable: true })
  @Field(() => String, { nullable: true })
  resource_level: string;

  @Column('tinyint', { name: 'family_resource', nullable: true })
  @Field(() => Boolean, { nullable: true })
  family_resource: boolean;

  @Column('tinyint', { name: 'allow_request', default: false })
  @Field(() => Boolean, { nullable: true })
  allow_request: boolean;

  @Column('tinyint', { name: 'deleted', default: false })
  @Field(() => Boolean, { nullable: true })
  deleted: boolean;

  @ManyToOne(() => SchoolYear, (schoolyear) => schoolyear.Resources, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'SchoolYearId', referencedColumnName: 'school_year_id' },
  ])
  @Field(() => SchoolYear, { nullable: true })
  SchoolYear: SchoolYear;
}
