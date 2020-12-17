import { SetStorageMock } from '@/data/test';
import { UnexpectedError } from '@/domain/errors';
import { mockAccountModel } from '@/domain/test';

import { LocalUpdateCurrentAccount } from './local-update-current-account';

type SutTypes = {
  sut: LocalUpdateCurrentAccount;
  setStorageMock: SetStorageMock;
};

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock();
  const sut = new LocalUpdateCurrentAccount(setStorageMock);

  return { sut, setStorageMock };
};

describe('LocalUpdateCurrentAccount', () => {
  test('Should call setStorage with correct value', () => {
    const { sut, setStorageMock } = makeSut();
    const account = mockAccountModel();

    sut.save(account);

    expect(setStorageMock.key).toBe('account');
    expect(setStorageMock.value).toBe(JSON.stringify(account));
  });

  test('Should throw if setStorage throws', async () => {
    const { sut, setStorageMock } = makeSut();
    jest.spyOn(setStorageMock, 'set').mockImplementation(() => {
      throw new Error();
    });

    expect(() => sut.save(mockAccountModel())).toThrow(Error);
  });

  test('Should throw if accessToken is falsy', async () => {
    const { sut } = makeSut();

    await expect(() => sut.save(undefined)).toThrow(UnexpectedError);
  });
});
