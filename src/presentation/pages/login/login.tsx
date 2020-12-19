import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Validation } from '@/presentation/protocols/validation';
import { Authentication } from '@/domain/usecases';

import { FormContext, ApiContext } from '@/presentation/contexts';

import { LoginHeader, Input, FormStatus, Footer, SubmitButton } from '@/presentation/components';

import Styles from './login-styles.scss';

type Props = {
  validation: Validation;
  authentication: Authentication;
};

const Login: React.FC<Props> = ({ validation, authentication }) => {
  const history = useHistory();
  const { setCurrentAccount } = useContext(ApiContext);
  const [state, setState] = useState({
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
  });

  const validate = (field: string): void => {
    const fieldError = validation.validate(field, state.formData);
    setState((old) => ({
      ...old,
      formErrors: {
        ...old.formErrors,
        [`${field}Error`]: fieldError,
      },
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
      setState({ ...state, isLoading: true });
      const account = await authentication.auth(state.formData);
      setCurrentAccount(account);
      history.replace('/');
    } catch (error) {
      setState({ ...state, isLoading: false, mainError: error.message });
    }
  };

  return (
    <div className={Styles.loginWrap}>
      <LoginHeader />

      <FormContext.Provider value={{ state, setState }}>
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
      </FormContext.Provider>

      <Footer />
    </div>
  );
};

export default Login;
