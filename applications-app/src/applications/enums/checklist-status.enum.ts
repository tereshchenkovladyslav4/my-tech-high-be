import { registerEnumType } from '@nestjs/graphql';

export enum CHECKLIST_STATUS {
  SUBJECT_CHECKLIST = 'Subject Checklist',
  INDEPENDENT_CHECKLIST = 'Independent Checklist',
}

registerEnumType(CHECKLIST_STATUS, {
  name: 'ChecklistStatusEnum',
});
