import { ReimbursementRequestStatus } from '../enums';
import { REIMBURSEMENT_REQUEST_STATUS_ITEMS } from '../constants/reimbursement-request-statuses';

export const reimbursementRequestStatus = (status: ReimbursementRequestStatus): string => {
  return REIMBURSEMENT_REQUEST_STATUS_ITEMS.find((x) => x.value === status)?.label?.toString() || status.toString();
};
