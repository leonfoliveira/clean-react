import React from 'react';

import { Signup } from '@/presentation/pages';
import { makeRemoteRegistration } from '@/main/factories/usecases/registration/remote-registration-factory';
import { makeLocalSaveAccessToken } from '@/main/factories/usecases/save-access-token/local-save-access-token-factory';
import { makeSignupValidation } from './signup-validation-factory';

export const makeSignup: React.FC = () => (
  <Signup
    registration={makeRemoteRegistration()}
    validation={makeSignupValidation()}
    saveAccessToken={makeLocalSaveAccessToken()}
  />
);
