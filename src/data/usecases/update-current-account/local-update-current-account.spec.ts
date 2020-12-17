import faker from 'faker';

import { SetStorageMock } from '@/data/test';
import { UnexpectedError } from '@/domain/errors';

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
  test('Should call setStorage with correct value', async () => {
    const { sut, setStorageMock } = makeSut();
    const account = {
      name: faker.name.findName(),
      accessToken: faker.random.uuid(),
    };

    await sut.save(account);

    expect(setStorageMock.key).toBe('account');
    expect(setStorageMock.value).toEqual(JSON.stringify(account));
  });

  test('Should throw if setStorage throws', async () => {
    const { sut, setStorageMock } = makeSut();
    jest.spyOn(setStorageMock, 'set').mockRejectedValueOnce(new Error());

    const promise = sut.save({
      name: faker.name.findName(),
      accessToken: faker.random.uuid(),
    });

    await expect(promise).rejects.toThrow(new Error());
  });

  test('Should throw if accessToken is falsy', async () => {
    const { sut } = makeSut();

    const promise = sut.save(undefined);

    await expect(promise).rejects.toThrow(new UnexpectedError());
  });
});
