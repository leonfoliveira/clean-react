import { atom } from 'recoil';

export const signupState = atom({
  key: 'signupState',
  default: {
    isLoading: false,
    isFormInvalid: true,
    mainError: '',
    formData: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    formErrors: {
      nameError: '',
      emailError: '',
      passwordError: '',
      passwordConfirmationError: '',
    },
  },
});
