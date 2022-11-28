import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Master } from './master.entity';
import { User } from './user.entity';
@ObjectType()
@Directive('@key(fields: "class_id,master_id,class_name,primary_id,addition_id")')
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

  @ManyToOne(() => Master, (master) => master.masterClasses)
  @Field(() => Master)
  @JoinColumn([{ name: 'master_id', referencedColumnName: 'master_id' }])
  master: Master;

  @ManyToOne(() => User, (user) => user.classes)
  @Field(() => User, { nullable: true })
  @JoinColumn({ name: 'primary_id', referencedColumnName: 'user_id' })
  primaryTeacher: User;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  created_at?: Date;
}
