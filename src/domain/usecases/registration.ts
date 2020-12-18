import { AccountModel } from '@/domain/models';

export interface Registration {
  register(params: Registration.Params): Promise<Registration.Model>;
}

export namespace Registration {
  export type Params = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  };

  export type Model = AccountModel;
}
