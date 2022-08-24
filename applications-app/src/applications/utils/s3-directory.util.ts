import { sprintf } from 'sprintf-js';

export const S3DirectoryStudentRecords = (
  region: string,
  studentId: number,
): string => {
  return sprintf('%s/Student Records/%s', region, studentId);
};
