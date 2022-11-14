import { Directive, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Subject } from './subject.entity';
import { Provider } from './provider.entity';
import { SchedulePeriod } from './schedule-period.entity';
import { SchedulePeriodHistory } from './schedule-period-history.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "id, school_year_id, period, category, grade_level_min, grade_level_max, message_period, notify_period, archived, Subjects, Providers")',
)
@Entity({ name: 'mth_period' })
export class Period extends BaseEntity {
  @Column()
  @Field((type) => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  id: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  @Directive('@external')
  school_year_id: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  @Directive('@external')
  period: number;

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  category: string;

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  grade_level_min: string;

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  grade_level_max: string;

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  message_period?: string;

  @Column()
  @Field((type) => Boolean, { nullable: true })
  @Directive('@external')
  notify_period?: boolean;

  @Column({ default: 0 })
  @Field((type) => Boolean, { nullable: true })
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
  @Field(() => [SchedulePeriod], { nullable: true })
  SchedulePeriods: SchedulePeriod[];

  @OneToMany(() => SchedulePeriodHistory, (schedulePeriodHistory) => schedulePeriodHistory.Period)
  @Field(() => [SchedulePeriodHistory], { nullable: true })
  SchedulePeriodHistories: SchedulePeriodHistory[];
}
