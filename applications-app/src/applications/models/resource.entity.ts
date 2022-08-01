import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive('@key(fields: "resource_id")')
@Entity({ name: 'mth_resource' })
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

  @Column()
  @Field(() => Boolean, { nullable: true })
  showCost: boolean;

  @Column('int', { name: 'cost', nullable: true })
  @Field(() => Int, { nullable: true })
  cost: number | null;

  @Column()
  @Field(() => String, { nullable: true })
  image: string;

  @Column('int', { name: 'sequence', nullable: true })
  @Field(() => Int, { nullable: true })
  sequence: number | null;

  @Column('varchar', { length: 100, nullable: true })
  @Field(() => String, { nullable: true })
  website: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  hidden: boolean;

  @Column()
  @Field(() => Boolean, { nullable: true })
  allowRequest: boolean;

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
