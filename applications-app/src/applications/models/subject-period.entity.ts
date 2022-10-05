import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Period } from './period.entity';
import { Subject } from './subject.entity';

@ObjectType()
@Directive('@key(fields: "subject_id, period_id")')
@Entity('mth_subject_period')
export class SubjectPeriod {
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  subject_id?: number;

  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  period_id?: number;

  @ManyToOne(() => Subject, (subject) => subject.Periods, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'subject_id', referencedColumnName: 'subject_id' }])
  @Field(() => Subject, { nullable: true })
  Subject: Subject;

  @ManyToOne(() => Period, (period) => period.Subjects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'period_id', referencedColumnName: 'id' }])
  @Field(() => Period, { nullable: true })
  Period: Period;
}
