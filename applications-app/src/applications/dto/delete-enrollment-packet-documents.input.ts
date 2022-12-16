import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DeleteEnrollmentPacketDocumentsInput {
  @Field(() => Int)
  packetId?: number;

  @Field(() => [Int], { defaultValue: [] })
  mthFileIds?: number[];
}
