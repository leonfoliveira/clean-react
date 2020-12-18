import { makeLocalStorageAdapter } from '@/main/factories/cache/local-storage-adapter-factory';
import { AccountModel } from '@/domain/models';

export const setCurrentAccountAdapter = (account: AccountModel) =>
  makeLocalStorageAdapter().set('account', account);

export const getCurrentAccountAdapter = (): AccountModel =>
  makeLocalStorageAdapter().get('account') as AccountModel;
