import { Directive, Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { HomeroomStudent } from './homeroom-student.entity';
import { Master } from './master.entity';
import { User } from './user.entity';
@InputType('classes')
@ObjectType()
@Directive('@key(fields: "class_id, master_id, class_name, primary_id, addition_id, created_at, PrimaryTeacher")')
@Entity('mth_classes')
export class Classes extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  class_id?: number;

  @Column()
  @Field(() => Int)
  master_id: number;

  @Column()
  @Field(() => String)
  class_name: string;

  @Column()
  @Field(() => Int, { nullable: true })
  primary_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  addition_id: string;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  created_at?: Date;

  @ManyToOne(() => Master, (master) => master.Classes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => Master, { nullable: true })
  @JoinColumn([{ name: 'master_id', referencedColumnName: 'master_id' }])
  Master: Master;

  @ManyToOne(() => User, (user) => user.Classes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => User, { nullable: true })
  @JoinColumn([{ name: 'primary_id', referencedColumnName: 'user_id' }])
  PrimaryTeacher: User;

  @OneToMany(() => HomeroomStudent, (homeroomStudent) => homeroomStudent.Class)
  @Field(() => [HomeroomStudent], { nullable: true })
  HomeroomStudents: HomeroomStudent[];
}
