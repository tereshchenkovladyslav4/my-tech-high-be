import { registerEnumType } from '@nestjs/graphql';

export enum SchedulePeriodStatus {
  UPDATE_REQUESTED = 'UPDATE_REQUESTED',
  UPDATE_REQUIRED = 'UPDATE_REQUIRED',
  RESUBMITTED = 'RESUBMITTED',
  NO_UPDATES = 'NO_UPDATES',
  MAKE_UPDATES = 'MAKE_UPDATES',
}

registerEnumType(SchedulePeriodStatus, {
  name: 'SchedulePeriodStatusEnum',
});
