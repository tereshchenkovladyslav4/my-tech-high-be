import { Student } from '../models/student.entity';
import { toOrdinalSuffix } from './string.util';

export const gradeText = (student: Student) => {
  if (!student.grade_levels?.length) {
    return '';
  }
  const gradeLevel = student.grade_levels[student.grade_levels.length - 1]?.grade_level;
  return gradeLevel.toLowerCase().startsWith('k') ? 'Kindergarten' : `${toOrdinalSuffix(+gradeLevel)} Grade`;
};
