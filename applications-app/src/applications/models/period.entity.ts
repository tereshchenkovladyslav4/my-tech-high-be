import { Directive, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable } from 'typeorm';
import { Subject } from './subject.entity';
import { Provider } from './provider.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id, school_year_id, period, category, archived")')
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

  @Column({ default: 0 })
  @Field((type) => Boolean, { nullable: true })
  @Directive('@external')
  archived?: boolean;

  @ManyToMany(() => Subject, (subject) => subject.Periods, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => [Subject], { nullable: true })
  Subjects: Subject[];

  @ManyToMany(() => Provider, (provider) => provider.Periods, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => [Provider], { nullable: true })
  Providers: Provider[];
}
