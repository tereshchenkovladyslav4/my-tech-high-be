import { registerEnumType } from '@nestjs/graphql';

export enum QUESTION_TYPE {
  DROPDOWN = 1,
  TEXTFIELD,
  CHECKBOX,
  AGREEMENT,
  MULTIPLECHOICES,
  CALENDAR,
  INFORMATION,
  UPLOAD,
  SIGNATURE,
  TEXTBOX,
}

registerEnumType(QUESTION_TYPE, {
  name: 'QUESTION_TYPE',
});
