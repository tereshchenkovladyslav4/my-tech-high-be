import { registerEnumType } from '@nestjs/graphql';

export enum WithdrawalStatus {
  NOTIFIED = 'Notified',
  WITHDRAWN = 'Withdrawn',
  REQUESTED = 'Requested',
}

registerEnumType(WithdrawalStatus, {
  name: 'WithdrawalStatus',
});
