import { registerEnumType } from '@nestjs/graphql';

export enum WithdrawalOption {
  NOTIFY_PARENT_OF_WITHDRAW = 1,
  NO_FORM_NO_EMAIL = 2,
  UNDECLARED_FORM_EMAIL = 3,
  UNDECLARED_FORM_NO_EMAIL = 4,
}

registerEnumType(WithdrawalOption, {
  name: 'WithdrawalOption',
});
