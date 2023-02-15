import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { HomeroomStudent } from './homeroom-student.entity';
import { User } from './user.entity';
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "class_id, master_id, class_name, primary_id, addition_id, created_at, PrimaryTeacher")')
@Entity('mth_classes')
export class Classes extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  class_id?: number;

  @Column()
  @Field(() => Int)
  @Directive('@external')
  master_id: number;

  @Column()
  @Field(() => String)
  @Directive('@external')
  class_name: string;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  primary_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  addition_id: string;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  @Directive('@external')
  created_at?: Date;

  @OneToMany((type) => HomeroomStudent, (homeroom) => homeroom.Class)
  @JoinColumn({ name: 'class_id', referencedColumnName: 'class_id' })
  @Field(() => [HomeroomStudent], { nullable: true })
  homeroom: HomeroomStudent[];

  @ManyToOne(() => User, (user) => user.UserClasses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => User, { nullable: true })
  @Directive('@external')
  @JoinColumn([{ name: 'primary_id', referencedColumnName: 'user_id' }])
  PrimaryTeacher: User;
}
