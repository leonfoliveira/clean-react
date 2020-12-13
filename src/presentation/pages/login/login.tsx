import React from 'react';

import { FormContextProvider } from '@/presentation/contexts/form/form-context';

import { LoginHeader, Input, FormStatus, Footer } from '@/presentation/components';

import Styles from './login-styles.scss';

const Login: React.FC = () => (
  <div className={Styles.login}>
    <LoginHeader />
    <FormContextProvider>
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
    </FormContextProvider>
  </div>
);

export default Login;
