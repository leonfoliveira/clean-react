import faker from 'faker';

import { AccountModel } from '@/domain/models';

export const mockAccountModel = (): AccountModel => ({
  name: faker.name.findName(),
  accessToken: faker.random.uuid(),
});
