import { Directive, Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Classes } from './classes.entity';

@InputType('homeroomStudent')
@ObjectType()
@Directive('@key(fields: "id, student_id, school_year_id, class_id, auto_grade, Class")')
@Entity('mth_homeroom_student')
export class HomeroomStudent extends BaseEntity {
  @Column()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field(() => Int)
  student_id?: number;

  @Column()
  @Field(() => Int)
  school_year_id?: number;

  @Column()
  @Field(() => Int)
  class_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  auto_grade?: string;

  @ManyToOne(() => Classes, (classes) => classes.HomeroomStudents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => Classes, { nullable: true })
  @JoinColumn([{ name: 'class_id', referencedColumnName: 'class_id' }])
  Class: Classes;
}
