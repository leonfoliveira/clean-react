import { AccountModel } from '@/domain/models';

export type RegistrationParams = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export interface Registration {
  register(params: RegistrationParams): Promise<AccountModel>;
}
