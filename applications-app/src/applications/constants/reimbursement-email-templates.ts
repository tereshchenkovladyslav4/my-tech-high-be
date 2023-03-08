import { EmailTemplateEnum, ReimbursementRequestStatus, StudentStatusEnum } from '../enums';

export const RB_EMAIL_TEMPLATES = {
  [ReimbursementRequestStatus.UPDATES_REQUIRED]: EmailTemplateEnum.RB_UPDATES_REQUIRED,
  [ReimbursementRequestStatus.APPROVED]: EmailTemplateEnum.RB_APPROVED,
  [ReimbursementRequestStatus.PAID]: EmailTemplateEnum.RB_PAID,
};

export const DO_EMAIL_TEMPLATES = {
  [ReimbursementRequestStatus.UPDATES_REQUIRED]: EmailTemplateEnum.DO_UPDATES_REQUIRED,
  [ReimbursementRequestStatus.APPROVED]: EmailTemplateEnum.DO_APPROVED,
  [ReimbursementRequestStatus.ORDERED]: EmailTemplateEnum.DO_ORDERED,
};
