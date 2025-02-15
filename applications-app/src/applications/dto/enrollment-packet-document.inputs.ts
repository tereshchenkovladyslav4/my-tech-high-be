import { Field, InputType, Int } from '@nestjs/graphql';
import { DocumentItemInput } from './document-item.inputs';
@InputType()
export class EnrollmentPacketDocumentInput {
  @Field(() => Int)
  packet_id?: number;

  @Field(() => [DocumentItemInput], { defaultValue: [] })
  documents?: DocumentItemInput[];
}
