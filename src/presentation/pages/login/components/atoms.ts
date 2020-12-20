import { atom } from 'recoil';

export const loginState = atom({
  key: 'loginState',
  default: {
    isLoading: false,
    isFormInvalid: true,
    mainError: '',
    formData: {
      email: '',
      password: '',
    },
    formErrors: {
      emailError: '',
      passwordError: '',
    },
  },
});
