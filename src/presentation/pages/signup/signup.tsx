import React, { useState, useEffect } from 'react';

import Context from '@/presentation/contexts/form-context';

import { Validation } from '@/presentation/protocols/validation';
import { LoginHeader, Input, FormStatus, Footer } from '@/presentation/components';

import Styles from './signup-styles.scss';

type Props = {
  validation: Validation;
};
const Signup: React.FC<Props> = ({ validation }) => {
  const [state, setState] = useState({
    isLoading: false,
    name: '',
    nameError: '',
    emailError: 'Campo Obrigatório',
    passwordError: 'Campo Obrigatório',
    passwordConfirmationError: 'Campo Obrigatório',
    mainError: '',
  });

  useEffect(() => {
    setState({
      ...state,
      nameError: validation.validate('name', state.name),
    });
  }, [state.name]);

  return (
    <div className={Styles.signup}>
      <LoginHeader />

      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form}>
          <h2>Criar Conta</h2>

          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu email" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <Input type="password" name="passwordConfirmation" placeholder="Repita sua senha" />

          <button className={Styles.submit} type="submit" disabled data-testid="submit">
            Entrar
          </button>

          <span className={Styles.link}>Voltar para Login</span>
          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  );
};

export default Signup;
