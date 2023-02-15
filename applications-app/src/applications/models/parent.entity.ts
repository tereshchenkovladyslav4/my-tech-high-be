import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Observer } from './observer.entity';
import { Person } from './person.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@key(fields: "parent_id, person_id, notes")')
@Entity({ name: 'mth_parent' })
export class Parent extends BaseEntity {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  parent_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  person_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  notes?: string;

  @OneToOne(() => Person)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToMany(() => Student, (student) => student.parent_id)
  students?: Student[];

  @OneToMany(() => Observer, (observer) => observer.parent_id)
  observers?: Observer[];
}
