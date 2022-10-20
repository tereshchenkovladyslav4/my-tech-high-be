import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToMany } from 'typeorm';
import { Subject } from './subject.entity';
import { Provider } from './provider.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "id, school_year_id, period, category, grade_level_min, grade_level_max, message_period, notify_period, archived, Subjects, Providers")',
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

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  category: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  grade_level_min: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  grade_level_max: string;

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
}
