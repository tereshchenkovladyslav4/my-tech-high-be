import { registerEnumType } from '@nestjs/graphql';

export enum ReimbursementRequestStatus {
  DRAFT = 'Draft',
  PAID = 'Paid',
  SUBMITTED = 'Submitted',
  RESUBMITTED = 'Resubmitted',
  UPDATES_REQUIRED = 'Updates Required',
}

registerEnumType(ReimbursementRequestStatus, {
  name: 'ReimbursementRequestStatus',
});
