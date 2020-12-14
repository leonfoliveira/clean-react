import faker from 'faker';

import { SetStorageMock } from '@/data/mocks/mock-storage';

import { LocalSaveAccessToken } from './local-save-access-token';

type SutTypes = {
  sut: LocalSaveAccessToken;
  setStorageMock: SetStorageMock;
};

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock();
  const sut = new LocalSaveAccessToken(setStorageMock);

  return { sut, setStorageMock };
};

describe('LocalSaveAccessToken', () => {
  test('Should call setStorage with correct value', async () => {
    const { sut, setStorageMock: setStorageSpy } = makeSut();
    const accessToken = faker.random.uuid();

    await sut.save(accessToken);

    expect(setStorageSpy.key).toBe('accessToken');
    expect(setStorageSpy.value).toBe(accessToken);
  });
});
