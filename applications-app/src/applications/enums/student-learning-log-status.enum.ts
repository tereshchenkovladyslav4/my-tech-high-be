import { registerEnumType } from '@nestjs/graphql';

export enum StudentLearningLogStatus {
  GRADED = 'Graded',
  STARTED = 'Started',
  RESUBMIT = 'Resubmit',
  RESUBMITTED = 'Resubmitted',
  SUBMITTED = 'Submitted',
  AVAILABLE = 'Available',
  EXCUSED = 'Excused',
  NANDA = 'N/A',
}

registerEnumType(StudentLearningLogStatus, {
  name: 'StudentStatusEnum',
});
