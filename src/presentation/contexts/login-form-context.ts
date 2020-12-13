import React, { createContext } from 'react';

type ContextProps = {
  state: {
    isLoading: boolean;
    email: string;
    emailError: string;
    password: string;
    passwordError: string;
    mainError: string;
  };
  setState: React.Dispatch<React.SetStateAction<ContextProps['state']>>;
};

export default createContext<ContextProps>(null);
