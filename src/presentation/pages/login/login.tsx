import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Validation } from '@/presentation/protocols/validation';
import { Authentication, SaveAccessToken } from '@/domain/usecases';

import Context from '@/presentation/contexts/login-form-context';

import { LoginHeader, Input, FormStatus, Footer } from '@/presentation/components';

import Styles from './login-styles.scss';

type Props = {
  validation: Validation;
  authentication: Authentication;
  saveAccessTokenMock: SaveAccessToken;
};
const Login: React.FC<Props> = ({ validation, authentication, saveAccessTokenMock }) => {
  const history = useHistory();
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      if (state.isLoading || state.emailError || state.passwordError) {
        return;
      }

      setState({ ...state, isLoading: true });
      const account = await authentication.auth({ email: state.email, password: state.password });
      await saveAccessTokenMock.save(account.accessToken);
      history.replace('/');
    } catch (error) {
      setState({ ...state, isLoading: false, mainError: error.message });
    }
  };

  return (
    <div className={Styles.login}>
      <LoginHeader />

      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} onSubmit={handleSubmit} data-testid="form">
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

          <Link className={Styles.link} to="/signup" data-testid="signup">
            Criar conta
          </Link>
          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  );
};

export default Login;
