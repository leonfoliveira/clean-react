import React, { useState, createContext, useContext, useEffect } from 'react';
import { Validation } from '@/presentation/protocols/validation';

type ContextProps = {
  state: {
    isLoading: boolean;
    email: '';
    emailError: string;
    password: '';
    passwordError: string;
    mainError: string;
  };
  setState: React.Dispatch<React.SetStateAction<ContextProps['state']>>;
};

const FormContext = createContext<ContextProps>(null);

type Props = {
  validation: Validation;
};
export const FormContextProvider: React.FC<Props> = ({ children, validation }) => {
  const [state, setState] = useState<ContextProps['state']>({
    isLoading: false,
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    mainError: '',
  });

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password),
    });
  }, [state.email, state.password]);

  return <FormContext.Provider value={{ state, setState }}>{children}</FormContext.Provider>;
};

export const useFormContext = () => useContext(FormContext);
