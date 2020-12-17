import faker from 'faker';
import 'jest-localstorage-mock';

import { LocalStorageAdapter } from './local-storage-adapter';

const makeSut = () => new LocalStorageAdapter();

describe('LocalStorageAdapter', () => {
  beforeEach(localStorage.clear);

  test('Should call localStorage with correct values', () => {
    const sut = makeSut();
    const key = faker.database.column();
    const value = faker.random.word();

    sut.set(key, value);

    expect(localStorage.setItem).toHaveBeenCalledWith(key, value);
  });
});
