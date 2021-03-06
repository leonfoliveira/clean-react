import React from 'react';

import { Signup } from '@/presentation/pages';
import { makeRemoteRegistration } from '@/main/factories/usecases';
import { makeSignupValidation } from './signup-validation-factory';

export const makeSignup: React.FC = () => (
  <Signup registration={makeRemoteRegistration()} validation={makeSignupValidation()} />
);
