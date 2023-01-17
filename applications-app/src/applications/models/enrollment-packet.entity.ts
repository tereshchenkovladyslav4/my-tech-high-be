import { Field, ObjectType } from '@nestjs/graphql';

import { Student } from './student.entity';
import { Packet } from './packet.entity';
@ObjectType()
export class EnrollmentPacket {
  @Field(() => Packet)
  packet?: Packet;

  @Field(() => Student)
  student?: Student;
}
