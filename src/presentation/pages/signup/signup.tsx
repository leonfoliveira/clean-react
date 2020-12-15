import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Context from '@/presentation/contexts/login-form-context';

import { LoginHeader, Input, FormStatus, Footer } from '@/presentation/components';

import Styles from './signup-styles.scss';

const Signup: React.FC = () => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
    mainError: '',
  });

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

          <button className={Styles.submit} type="submit">
            Entrar
          </button>

          <Link className={Styles.link} to="/login">
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
