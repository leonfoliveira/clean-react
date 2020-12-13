import React, { useState, createContext, useContext } from 'react';

type StateProps = {
  state: {
    isLoading: boolean;
  };
  errorState: {
    email: string;
    password: string;
    main: string;
  };
};

const FormContext = createContext<StateProps>(null);

export const FormContextProvider: React.FC = ({ children }) => {
  const [state] = useState<StateProps['state']>({
    isLoading: false,
  });

  const [errorState] = useState<StateProps['errorState']>({
    email: 'Campo obrigatório',
    password: 'Campo obrigatório',
    main: '',
  });

  return <FormContext.Provider value={{ state, errorState }}>{children}</FormContext.Provider>;
};

export const useFormContext = () => useContext(FormContext);
