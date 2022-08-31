import { registerEnumType } from '@nestjs/graphql';

export enum WithdrawOption {
  NOTIFY = 'notify',
  NO_FORM_NO_EMAIL = 'no_form_no_email',
  UNDECLARED_FORM_EMAIL = 'undeclared_form_email',
  UNDECLARED_FORM_NO_EMAIL = 'undeclared_form_no_email',
}

registerEnumType(WithdrawOption, {
  name: 'WithdrawOption',
});
