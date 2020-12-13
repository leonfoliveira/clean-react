import React from 'react';
import { Validation } from '@/presentation/protocols/validation';

import { LoginContextProvider } from '@/presentation/pages/login/login-context';

import { LoginHeader, Input, FormStatus, Footer } from '@/presentation/components';

import Styles from './login-styles.scss';

type Props = {
  validation: Validation;
};
const Login: React.FC<Props> = ({ validation }) => (
  <div className={Styles.login}>
    <LoginHeader />

    <LoginContextProvider validation={validation}>
      <form className={Styles.form} action="">
        <h2>Login</h2>

        <Input type="email" name="email" placeholder="Digite seu email" />
        <Input type="password" name="password" placeholder="Digite sua senha" />

        <button className={Styles.submit} type="submit" disabled data-testid="submit">
          Entrar
        </button>

        <span className={Styles.link}>Criar conta</span>
        <FormStatus />
      </form>
    </LoginContextProvider>

    <Footer />
  </div>
);

export default Login;
