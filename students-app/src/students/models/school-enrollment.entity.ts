import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SchoolPartner } from './school-partner.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@key(fields: "id, student_id, school_year_id, school_partner_id")')
@Entity({ name: 'mth_school_enrollment' })
export class SchoolEnrollment extends BaseEntity {
  @Column()
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(() => Int)
  student_id: number;

  @Column()
  @Field(() => Int)
  school_year_id: number;

  @Column()
  @Field(() => Int)
  school_partner_id: number;

  @ManyToOne((type) => Student, (student) => student.currentSoe)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  student?: Student;

  @ManyToOne((type) => SchoolPartner, (partner) => partner.schoolEnrollment)
  @JoinColumn({
    name: 'school_partner_id',
    referencedColumnName: 'school_partner_id',
  })
  @Field(() => SchoolPartner, { nullable: true })
  partner?: SchoolPartner;
}
