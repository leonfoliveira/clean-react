import React, { useState, createContext, useContext } from 'react';

type StateProps = {
  isLoading: boolean;
  errorMessage: string;
};

const FormContext = createContext<StateProps>(null);

export const FormContextProvider: React.FC = ({ children }) => {
  const [state] = useState<StateProps>({ isLoading: false, errorMessage: '' });

  return <FormContext.Provider value={state}>{children}</FormContext.Provider>;
};

export const useFormContext = () => useContext(FormContext);
