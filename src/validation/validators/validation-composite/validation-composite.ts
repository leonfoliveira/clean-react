import { Validation } from '@/presentation/protocols/validation';
import { FieldValidation } from '@/validation/protocols/field-validation';

export class ValidationComposite implements Validation {
  private constructor(private readonly validators: FieldValidation[]) {}

  static build(validators: FieldValidation[]): ValidationComposite {
    return new ValidationComposite(validators);
  }

  validate(fieldName: string, input: object): string {
    const validators = this.validators.filter((v) => v.field === fieldName);

    const error = validators.reduce((curr, v) => {
      if (curr) {
        return curr;
      }
      const test = v.validate(input);
      return test ? test.message : curr;
    }, '');

    return error;
  }
}
