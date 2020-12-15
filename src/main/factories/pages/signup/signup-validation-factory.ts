import { ValidationComposite } from '@/validation/validators';
import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder';

export const makeSignupValidation = (): ValidationComposite =>
  ValidationComposite.build([
    ...Builder.field('name').required().build(),
    ...Builder.field('email').required().email().build(),
    ...Builder.field('password').required().min(5).build(),
    ...Builder.field('passwordConfirmation').required().sameAs('password').build(),
  ]);
