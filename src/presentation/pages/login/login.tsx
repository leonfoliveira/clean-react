import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import { Validation } from '@/presentation/protocols/validation';
import { Authentication } from '@/domain/usecases';
import { LoginHeader, Footer, currentAccountState } from '@/presentation/components';
import { loginState, Input, SubmitButton, FormStatus } from './components';

import Styles from './login-styles.scss';

type Props = {
  validation: Validation;
  authentication: Authentication;
};

const Login: React.FC<Props> = ({ validation, authentication }) => {
  const resetLoginState = useResetRecoilState(loginState);
  const history = useHistory();
  const { setCurrentAccount } = useRecoilValue(currentAccountState);
  const [state, setState] = useRecoilState(loginState);

  useEffect(() => resetLoginState, []);

  const validate = (field: string): void => {
    const fieldError = validation.validate(field, state.formData);
    setState((old) => ({
      ...old,
      formErrors: { ...old.formErrors, [`${field}Error`]: fieldError },
    }));
    setState((old) => ({
      ...old,
      isFormInvalid: Object.values(old.formErrors).some((error) => error),
    }));
  };

  useEffect(() => {
    Object.keys(state.formData).forEach((field) => validate(field));
  }, [state.formData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      if (state.isLoading || state.isFormInvalid) {
        return;
      }
      setState((old) => ({ ...old, isLoading: true }));
      const account = await authentication.auth(state.formData);
      setCurrentAccount(account);
      history.replace('/');
    } catch (error) {
      setState((old) => ({ ...old, isLoading: false, mainError: error.message }));
    }
  };

  return (
    <div className={Styles.loginWrap}>
      <LoginHeader />
      <form className={Styles.form} onSubmit={handleSubmit} data-testid="form">
        <h2>Login</h2>

        <Input type="email" name="email" placeholder="Digite seu email" />
        <Input type="password" name="password" placeholder="Digite sua senha" />

        <SubmitButton text="Entrar" />

        <Link className={Styles.link} to="/signup" replace data-testid="signup-link">
          Criar conta
        </Link>
        <FormStatus />
      </form>
      <Footer />
    </div>
  );
};

export default Login;
