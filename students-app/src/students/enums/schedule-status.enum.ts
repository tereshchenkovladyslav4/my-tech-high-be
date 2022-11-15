import { registerEnumType } from '@nestjs/graphql';

export enum ScheduleStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  ACCEPTED = 'Accepted',
  RESUBMITTED = 'Resubmitted',
  UPDATES_REQUESTED = 'Updates Requested',
  UPDATES_REQUIRED = 'Updates Required',
  NOT_SUBMITTED = 'Not Submitted',
}

registerEnumType(ScheduleStatus, {
  name: 'ScheduleStatus',
});
