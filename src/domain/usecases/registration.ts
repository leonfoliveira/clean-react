import { AccountModel } from '@/domain/models';

export type RegistrationParams = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export interface Registration {
  register(params: RegistrationParams): Promise<AccountModel>;
}
