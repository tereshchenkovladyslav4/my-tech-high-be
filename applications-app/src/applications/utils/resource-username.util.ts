import { UsernameFormat } from '../enums';
import { Resource } from '../models/resource.entity';
import { Student } from '../models/student.entity';

export const resourceUsername = (resource: Resource, student: Student): string => {
  switch (resource.std_username_format) {
    case UsernameFormat.GENERIC: {
      return resource.std_user_name;
    }
    case UsernameFormat.FIRST_LAST: {
      return student.username_first_last;
    }
    case UsernameFormat.LAST_FIRST_YEAR: {
      return student.username_last_first_year;
    }
    case UsernameFormat.LAST_FIRST: {
      return student.username_last_first;
    }
    case UsernameFormat.LAST_FIRSTINITIAL: {
      return student.username_last_firstinitial;
    }
    case UsernameFormat.LAST_FIRST_MTH: {
      return student.username_last_first_mth;
    }
    case UsernameFormat.LAST_FIRST_BIRTH_YEAR: {
      return student.username_last_first_birth;
    }
    case UsernameFormat.FIRST_LAST_DOMAIN: {
      return student.username_first_last_domain;
    }
    case UsernameFormat.STUDENT_EMAIL: {
      return student.username_student_email;
    }
    case UsernameFormat.PARENT_EMAIL: {
      return student.username_parent_email;
    }
  }

  return '';
};
