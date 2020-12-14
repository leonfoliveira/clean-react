import { SaveAccessToken } from '@/domain/usecases';
import { LocalSaveAccessToken } from '@/data/usecases/save-access-token/local-save-access-token';
import { makeLocalStorageAdapter } from '@/main/factories/cache/local-storage-adapter-factory';

export const makeLocalSaveAccessToken = (): SaveAccessToken =>
  new LocalSaveAccessToken(makeLocalStorageAdapter());
