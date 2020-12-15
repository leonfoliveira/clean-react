import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Context from '@/presentation/contexts/form-context';

import { Validation } from '@/presentation/protocols/validation';
import { LoginHeader, Input, FormStatus, Footer } from '@/presentation/components';
import { Registration, SaveAccessToken } from '@/domain/usecases';

import Styles from './signup-styles.scss';

type Props = {
  validation: Validation;
  registration: Registration;
  saveAccessToken: SaveAccessToken;
};
const Signup: React.FC<Props> = ({ validation, registration, saveAccessToken }) => {
  const history = useHistory();
  const [state, setState] = useState({
    isLoading: false,
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
    setState({
      ...state,
      nameError: validation.validate('name', state.name),
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password),
      passwordConfirmationError: validation.validate(
        'passwordConfirmation',
        state.passwordConfirmation,
      ),
    });
  }, [state.name, state.email, state.password, state.passwordConfirmation]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      if (
        state.isLoading ||
        state.nameError ||
        state.emailError ||
        state.passwordError ||
        state.passwordConfirmationError
      ) {
        return;
      }

      setState({ ...state, isLoading: true });
      const account = await registration.register({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
      });
      await saveAccessToken.save(account.accessToken);
      history.replace('/');
    } catch (error) {
      setState({ ...state, isLoading: false, mainError: error.message });
    }
  };

  return (
    <div className={Styles.signup}>
      <LoginHeader />

      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} onSubmit={handleSubmit} data-testid="form">
          <h2>Criar Conta</h2>

          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu email" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <Input type="password" name="passwordConfirmation" placeholder="Repita sua senha" />

          <button
            className={Styles.submit}
            type="submit"
            disabled={
              !!state.nameError ||
              !!state.emailError ||
              !!state.passwordError ||
              !!state.passwordConfirmationError
            }
            data-testid="submit"
          >
            Entrar
          </button>

          <Link className={Styles.link} to="/login" replace data-testid="login-link">
            Voltar para Login
          </Link>
          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  );
};

export default Signup;
