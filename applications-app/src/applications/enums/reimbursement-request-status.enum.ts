import { registerEnumType } from '@nestjs/graphql';

export enum ReimbursementRequestStatus {
  DRAFT = 'Draft',
  PAID = 'Paid',
  SUBMITTED = 'Submitted',
  RESUBMITTED = 'Resubmitted',
  UPDATES_REQUIRED = 'Updates Required',
  APPROVED = 'Approved',
  ORDERED = 'Ordered',
}

registerEnumType(ReimbursementRequestStatus, {
  name: 'ReimbursementRequestStatus',
});
