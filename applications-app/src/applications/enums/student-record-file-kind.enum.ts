import { registerEnumType } from '@nestjs/graphql';

export enum StudentRecordFileKind {
  STUDENT_PACKET = 'Student Packet',
  WITHDRAWAL_FORM = 'Withdrawal Forms',
  OPT_OUT_FORM = 'Opt-out Forms',
  USIRS = 'USIRS',
}

registerEnumType(StudentRecordFileKind, {
  name: 'WithdrawalStatus',
});
