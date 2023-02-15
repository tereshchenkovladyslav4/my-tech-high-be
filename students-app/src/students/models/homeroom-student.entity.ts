import { Directive, Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Classes } from './classes.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id, student_id, school_year_id, class_id, auto_grade, Class")')
@Entity('mth_homeroom_student')
export class HomeroomStudent extends BaseEntity {
  @Column()
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  @Directive('@external')
  id?: number;

  @Column()
  @Field(() => Int)
  @Directive('@external')
  student_id?: number;

  @Column()
  @Field(() => Int)
  @Directive('@external')
  school_year_id?: number;

  @Column()
  @Field(() => Int)
  @Directive('@external')
  class_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  auto_grade?: string;

  @OneToMany((type) => Student, (student) => student.currentHomeroom)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  @Field(() => [Student], { nullable: true })
  student: Student[];

  @ManyToOne((type) => Classes, (classes) => classes.homeroom, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id', referencedColumnName: 'class_id' })
  @Field(() => Classes, { nullable: true })
  @Directive('@external')
  Class: Classes;
}
