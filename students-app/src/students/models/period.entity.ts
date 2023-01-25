import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToMany, OneToMany } from 'typeorm';
import { Subject } from './subject.entity';
import { Provider } from './provider.entity';
import { SEMESTER_TYPE } from '../enums';
import { SchedulePeriod } from './schedule-period.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "id, school_year_id, period, diploma_seeking_path, category, min_grade, max_grade, semester, message_period, notify_period, archived, Subjects, Providers")',
)
@Entity({ name: 'mth_period' })
export class Period extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  school_year_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  period: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  diploma_seeking_path: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  category: string;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  min_grade: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  max_grade: number;

  @Column({
    type: 'enum',
    enum: SEMESTER_TYPE,
    comment: 'NONE: NONE(default), PERIOD: PERIOD, SUBJECT: SUBJECT',
  })
  @Field(() => SEMESTER_TYPE, { nullable: true })
  @Directive('@external')
  semester?: SEMESTER_TYPE;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  message_period?: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  notify_period?: boolean;

  @Column({ default: 0 })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  archived?: boolean;

  @ManyToMany(() => Subject, (subject) => subject.Periods, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => [Subject], { nullable: true })
  @Directive('@external')
  Subjects: Subject[];

  @ManyToMany(() => Provider, (provider) => provider.Periods, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => [Provider], { nullable: true })
  @Directive('@external')
  Providers: Provider[];

  @OneToMany(() => SchedulePeriod, (schedulePeriod) => schedulePeriod.Period)
  SchedulePeriods: SchedulePeriod[];
}
