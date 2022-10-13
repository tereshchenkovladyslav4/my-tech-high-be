import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Parent } from './parent.entity';
import { Student } from './student.entity';
import { Packet } from './packet.entity';

@ObjectType()
export class EnrollmentPacket {
  @Field((type) => Packet)
  packet?: Packet;

  @Field((type) => Student)
  student?: Student;
}
