import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Student } from './student.entity';
import { SchoolYear } from './schoolyear.entity';
import { ApplicationEmail } from './application-email.entity';

@ObjectType()
@Directive('@key(fields: "application_id")')
@Entity('mth_application')
export class Application extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  application_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  student_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  school_year_id?: number;

  @Column()
  @Field(() => Boolean, { nullable: true })
  midyear_application?: boolean;

  @Column()
  @Field(() => Boolean, { nullable: true })
  hidden?: boolean;

  @Column()
  @Field(() => String, { nullable: true })
  status?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  relation_status?: number;

  @Column()
  @Field(() => String, { nullable: true })
  referred_by?: string;

  @Column()
  @Field(() => String, { nullable: true })
  city_of_residence?: string;

  @Column()
  @Field(() => Date, { nullable: true })
  date_started?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  date_submitted?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  date_accepted?: Date;

  @Column()
  @Field(() => String, { nullable: true })
  meta?: string;

  @Column()
  @Field(() => String, { nullable: true })
  secondary_contact_first?: string;

  @Column()
  @Field(() => String, { nullable: true })
  secondary_contact_last?: string;

  @ManyToOne((type) => Student, { nullable: true })
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  student?: Student;

  @ManyToOne((type) => SchoolYear, { nullable: true })
  @JoinColumn({
    name: 'school_year_id',
    referencedColumnName: 'school_year_id',
  })
  school_year?: SchoolYear;

  @OneToMany(
    (type) => ApplicationEmail,
    (application_email) => application_email.application,
  )
  @JoinColumn({
    name: 'application_id',
    referencedColumnName: 'application_id',
  })
  application_emails: ApplicationEmail[];
}
