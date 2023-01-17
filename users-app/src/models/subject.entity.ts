import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Title } from './title.entity';
import { Period } from './period.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "subject_id, SchoolYearId, name, priority, allow_request, is_active, deleted, Titles, Periods")',
)
@Entity({ name: 'mth_subject' })
export class Subject extends BaseEntity {
  @Column('int', { name: 'subject_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  subject_id?: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  SchoolYearId: number | null;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  name: string;

  @Column('int', { name: 'priority', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  priority: number | null;

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

  @OneToMany(() => Title, (title) => title.Subject)
  @Field(() => [Title], { nullable: true })
  @Directive('@external')
  Titles: Title[];

  @ManyToMany(() => Period, (period) => period.Subjects)
  @JoinTable({
    name: 'mth_subject_period',
    joinColumn: { name: 'subject_id', referencedColumnName: 'subject_id' },
    inverseJoinColumn: { name: 'period_id', referencedColumnName: 'id' },
  })
  @Field(() => [Period], { nullable: true })
  @Directive('@external')
  Periods: Period[];
}
