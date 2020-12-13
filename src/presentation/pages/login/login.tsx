import React, { useState, useEffect } from 'react';
import { Validation } from '@/presentation/protocols/validation';

import Context from '@/presentation/contexts/login-form-context';

import { LoginHeader, Input, FormStatus, Footer } from '@/presentation/components';

import Styles from './login-styles.scss';

type Props = {
  validation: Validation;
};
const Login: React.FC<Props> = ({ validation }) => {
  const [state, setState] = useState({
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

  return (
    <div className={Styles.login}>
      <LoginHeader />

      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} action="">
          <h2>Login</h2>

          <Input type="email" name="email" placeholder="Digite seu email" />
          <Input type="password" name="password" placeholder="Digite sua senha" />

          <button
            className={Styles.submit}
            type="submit"
            disabled={!!state.emailError || !!state.passwordError}
            data-testid="submit"
          >
            Entrar
          </button>

          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  );
};

export default Login;
