import { AccountModel } from '@/domain/models';
import faker from 'faker';
import 'jest-localstorage-mock';

import { LocalStorageAdapter } from './local-storage-adapter';

const makeSut = () => new LocalStorageAdapter();

describe('LocalStorageAdapter', () => {
  beforeEach(localStorage.clear);

  test('Should call localStorage.setItem with correct values', () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = faker.random.objectElement<AccountModel>();

    sut.set(key, value);

    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  test('Should call localStorage.removeItem if values is null', () => {
    const sut = makeSut();
    const key = faker.database.column();

    sut.set(key, null);

    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  test('Should call localStorage.getItem with correct values', () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = faker.random.objectElement<AccountModel>();
    const getItemSpy = jest
      .spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(JSON.stringify(value));

    const obj = sut.get(key);

    expect(obj).toEqual(value);
    expect(getItemSpy).toHaveBeenCalledWith(key);
  });
});
