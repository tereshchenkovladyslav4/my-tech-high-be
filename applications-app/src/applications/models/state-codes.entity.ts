import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Title } from './title.entity';

@ObjectType()
@Directive('@key(fields: "state_codes_id, TitleId, title_name, state_code, grade, teacher, subject")')
@Entity({ name: 'mth_state_codes' })
export class StateCodes extends BaseEntity {
  @Column('int', { name: 'state_codes_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  state_codes_id: number;

  @Column('int', { name: 'TitleId', nullable: true })
  @Field(() => Int, { nullable: true })
  TitleId: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  title_name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  state_code: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  grade: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  teacher: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  subject: string;

  @ManyToOne(() => Title, (title) => title.StateCodes, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'TitleId', referencedColumnName: 'title_id' }])
  Title: Title;
}
