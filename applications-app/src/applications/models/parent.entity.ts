import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Observer } from './observer.entity';
import { Person } from './person.entity';
import { Phone } from './phone.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@key(fields: "parent_id, person_id")')
@Entity({ name: 'mth_parent' })
export class Parent extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  parent_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  person_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  notes?: string;

  @OneToOne((type) => Person)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToMany((type) => Student, (student) => student.parent_id)
  students?: Student[];

  @OneToMany((type) => Observer, (observer) => observer.parent_id)
  observers?: Observer[];
}
