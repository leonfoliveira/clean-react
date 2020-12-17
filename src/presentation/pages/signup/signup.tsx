import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { ApiContext, FormContext } from '@/presentation/contexts';

import { Validation } from '@/presentation/protocols/validation';
import { LoginHeader, Input, FormStatus, Footer, SubmitButton } from '@/presentation/components';
import { Registration } from '@/domain/usecases';

import Styles from './signup-styles.scss';

type Props = {
  validation: Validation;
  registration: Registration;
};
const Signup: React.FC<Props> = ({ validation, registration }) => {
  const history = useHistory();
  const { setCurrentAccount } = useContext(ApiContext);
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    name: '',
    nameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    passwordConfirmation: '',
    passwordConfirmationError: '',
    mainError: '',
  });

  useEffect(() => {
    const { name, email, password, passwordConfirmation } = state;
    const formData = { name, email, password, passwordConfirmation };
    const nameError = validation.validate('name', formData);
    const emailError = validation.validate('email', formData);
    const passwordError = validation.validate('password', formData);
    const passwordConfirmationError = validation.validate('passwordConfirmation', formData);
    setState({
      ...state,
      nameError,
      emailError,
      passwordError,
      passwordConfirmationError,
      isFormInvalid: !!nameError || !!emailError || !!passwordError || !!passwordConfirmationError,
    });
  }, [state.name, state.email, state.password, state.passwordConfirmation]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      if (state.isLoading || state.isFormInvalid) {
        return;
      }

      setState({ ...state, isLoading: true });
      const account = await registration.register({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
      });
      setCurrentAccount(account);
      history.replace('/');
    } catch (error) {
      setState({ ...state, isLoading: false, mainError: error.message });
    }
  };

  return (
    <div className={Styles.signupWrap}>
      <LoginHeader />

      <FormContext.Provider value={{ state, setState }}>
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
      </FormContext.Provider>

      <Footer />
    </div>
  );
};

export default Signup;
