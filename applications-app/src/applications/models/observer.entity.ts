import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Person } from './person.entity';
@ObjectType()
@Directive('@key(fields: "observer_id")')
@Entity('mth_observer')
export class Observer extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  observer_id?: number;

  @Column()
  @Field(() => Int)
  person_id?: number;

  @Column()
  @Field(() => Int)
  parent_id?: number;

  @Column()
  @Field(() => Int)
  student_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  created_at?: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updated_at?: Date;

  @OneToOne((type) => Person, (person) => person.person_id)
  @JoinColumn({ name: 'person_id', referencedColumnName: 'person_id' })
  person: Person;
}
