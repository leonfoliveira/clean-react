import React, { useState } from 'react';

import Context from '@/presentation/contexts/form/form-context';

import { LoginHeader, Input, FormStatus, Footer } from '@/presentation/components';

import Styles from './login-styles.scss';

type StateProps = {
  isLoading: boolean;
  errorMessage: string;
};
const Login: React.FC = () => {
  const [state] = useState<StateProps>({ isLoading: false, errorMessage: '' });

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={state}>
        <form className={Styles.form} action="">
          <h2>Login</h2>

          <Input type="email" name="email" placeholder="Digite seu email" />
          <Input type="password" name="password" placeholder="Digite sua senha" />

          <button className={Styles.submit} type="submit">
            Entrar
          </button>

          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
        <Footer />
      </Context.Provider>
    </div>
  );
};

export default Login;
