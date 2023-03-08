import { ReimbursementRequestStatus } from '../enums';

export const REIMBURSEMENT_REQUEST_STATUS_ITEMS = [
  { label: 'Not Submitted', value: ReimbursementRequestStatus.DRAFT.toString() },
  { label: 'Submitted', value: ReimbursementRequestStatus.SUBMITTED.toString() },
  { label: 'Resubmitted', value: ReimbursementRequestStatus.RESUBMITTED.toString() },
  { label: 'Updates Required', value: ReimbursementRequestStatus.UPDATES_REQUIRED.toString() },
  { label: 'Approved', value: ReimbursementRequestStatus.APPROVED.toString() },
  { label: 'Paid', value: ReimbursementRequestStatus.PAID.toString() },
  { label: 'Ordered', value: ReimbursementRequestStatus.ORDERED.toString() },
];
