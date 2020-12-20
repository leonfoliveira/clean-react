import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import { Validation } from '@/presentation/protocols/validation';
import { LoginHeader, Footer, currentAccountState } from '@/presentation/components';
import { Registration } from '@/domain/usecases';
import { Input, signupState, SubmitButton, FormStatus } from './components';

import Styles from './signup-styles.scss';

type Props = {
  validation: Validation;
  registration: Registration;
};

const Signup: React.FC<Props> = ({ validation, registration }) => {
  const resetSignupState = useResetRecoilState(signupState);
  const history = useHistory();
  const { setCurrentAccount } = useRecoilValue(currentAccountState);
  const [state, setState] = useRecoilState(signupState);

  useEffect(() => resetSignupState, []);

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
      isFormInvalid: Object.values({ ...old.formErrors, [`${field}Error`]: fieldError }).some(
        (error) => error,
      ),
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
      const account = await registration.register(state.formData);
      setCurrentAccount(account);
      history.replace('/');
    } catch (error) {
      setState((old) => ({ ...old, isLoading: false, mainError: error.message }));
    }
  };

  return (
    <div className={Styles.signupWrap}>
      <LoginHeader />
      <form className={Styles.form} onSubmit={handleSubmit} data-testid="form">
        <h2>Criar Conta</h2>

        <Input type="text" name="name" placeholder="Digite seu nome" />
        <Input type="email" name="email" placeholder="Digite seu email" />
        <Input type="password" name="password" placeholder="Digite sua senha" />
        <Input type="password" name="passwordConfirmation" placeholder="Repita sua senha" />

        <SubmitButton text="Cadastrar" />

        <Link className={Styles.link} to="/login" replace data-testid="login-link">
          Voltar para Login
        </Link>
        <FormStatus />
      </form>
      <Footer />
    </div>
  );
};

export default Signup;
