import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { SchoolYear } from './schoolyear.entity';
import { Title } from './title.entity';
import { Period } from './period.entity';
import { Course } from './course.entity';

@ObjectType()
@Directive('@key(fields: "subject_id, SchoolYearId, name, priority, is_active, Titles, Periods")')
@Entity({ name: 'mth_subject' })
export class Subject extends BaseEntity {
  @Column('int', { name: 'subject_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  subject_id?: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  SchoolYearId: number | null;

  @Column()
  @Field(() => String, { nullable: true })
  name: string;

  @Column('int', { name: 'priority', nullable: true })
  @Field(() => Int, { nullable: true })
  priority: number | null;

  @Column('tinyint', { name: 'is_active', default: true })
  @Field(() => Boolean, { nullable: true })
  is_active: boolean;

  @Column('tinyint', { name: 'deleted', default: false })
  @Field(() => Boolean, { nullable: true })
  deleted: boolean;

  @ManyToOne(() => SchoolYear, (schoolyear) => schoolyear.Subjects, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  @Field(() => SchoolYear, { nullable: true })
  SchoolYear: SchoolYear;

  @OneToMany(() => Title, (title) => title.Subject)
  @Field(() => [Title], { nullable: true })
  Titles: Title[];

  @ManyToMany(() => Period, (period) => period.Subjects)
  @JoinTable({
    name: 'mth_subject_period',
    joinColumn: { name: 'subject_id', referencedColumnName: 'subject_id' },
    inverseJoinColumn: { name: 'period_id', referencedColumnName: 'id' },
  })
  @Field(() => [Period], { nullable: true })
  Periods: Period[];

  @OneToMany(() => Course, (course) => course.Subject)
  @Field(() => [Course], { nullable: true })
  Courses: Course[];
}
