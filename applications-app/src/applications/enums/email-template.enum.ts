import { registerEnumType } from '@nestjs/graphql';

export enum EmailTemplateEnum {
  APPLICATION_PAGE = 'Application Page',
  AGE_ISSUE = 'Age Issue',
  SCHEDULE_ACCEPTED = 'Accepted',
  SECOND_SEMESTER_ACCEPTED = '2nd Semester Accepted',
  SECOND_SEMESTER_UNLOCKED = '2nd Semester Unlocked',
  APP_PAGE = 'App Page',
  APPLICATION_ACCEPTED = 'Application Accepted',
  APPLICATION_RECEIVED = 'Application Received',
  EMAIL_CHANGED = 'Email Changed',
  EMAIL_VERIFICATION = 'Email Verification',
  ENROLLMENT_PACKET_PAGE = 'Enrollment Packet Page',
  FORGOT_PASSWORD = 'Forgot Password',
  MISSING_INFORMATION = 'Missing Information',
  NOTIFY_OF_WITHDRAW = 'Notify of Withdraw',
  PACKET_ACCEPTED = 'Packet Accepted',
  PACKET_REMINDERS = 'Packet Reminders',
  UNDECLARED_WITHDRAW = 'Undeclared Withdraw',
  UPDATES_ALLOWED = 'Updates Allowed',
  UPDATES_REQUIRED = 'Updates Required',
  WITHDRAW_CONFIRMATION = 'Withdraw Confirmation',
  WITHDRAW_PAGE = 'Withdraw Page',
  ANNOUNCEMENT = 'Announcemnet',
  // Reimbursement Emails
  RB_UPDATES_REQUIRED = 'Reimbursement Updates Required',
  RB_APPROVED = 'Reimbursement Approved',
  RB_PAID = 'Reimbursement Paid',
  DO_UPDATES_REQUIRED = 'Direct Order Updates Required',
  DO_APPROVED = 'Direct Order Approved',
  DO_ORDERED = 'Direct Order Ordered',
}

registerEnumType(EmailTemplateEnum, {
  name: 'EmailTemplateEnum',
});
