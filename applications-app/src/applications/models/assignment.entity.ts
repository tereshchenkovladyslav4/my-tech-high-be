import { Directive, Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Master } from './master.entity';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { StudentLearningLog } from './student-learning-log.entity';

@InputType('assignment')
@ObjectType()
@Directive('@key(fields: "master_id")')
@Entity('mth_assignments')
export class Assignment extends BaseEntity {
  @Column()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field(() => Int)
  master_id: number;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => Date)
  due_date: Date;

  @Column()
  @Field(() => Date)
  reminder_date: Date;

  @Column()
  @Field(() => Date)
  auto_grade: Date;

  @Column()
  @Field(() => Date)
  teacher_deadline: Date;

  @Column()
  @Field(() => Int)
  auto_grade_email: number;

  @Column()
  @Field(() => Int)
  page_count: number;

  @ManyToOne(() => Master, (master) => master.Assignments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => Master, { nullable: true })
  @JoinColumn([{ name: 'master_id', referencedColumnName: 'master_id' }])
  Master: Master;

  @OneToMany(() => StudentLearningLog, (studentLearningLog) => studentLearningLog.Assignment)
  @Field(() => [StudentLearningLog], { nullable: true })
  StudentLearningLogs: StudentLearningLog[];
}
