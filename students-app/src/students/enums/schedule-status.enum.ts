import { registerEnumType } from '@nestjs/graphql';

export enum ScheduleStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  ACCEPTED = 'Accepted',
}

registerEnumType(ScheduleStatus, {
  name: 'ScheduleStatus',
});
