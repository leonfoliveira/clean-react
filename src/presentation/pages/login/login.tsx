import React from 'react';
import { Validation } from '@/presentation/protocols/validation';

import { FormContextProvider } from '@/presentation/contexts/form/form-context';

import { LoginHeader, Input, FormStatus, Footer } from '@/presentation/components';

import Styles from './login-styles.scss';

type Props = {
  validation: Validation;
};
const Login: React.FC<Props> = ({ validation }) => (
  <div className={Styles.login}>
    <LoginHeader />

    <FormContextProvider validation={validation}>
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
    </FormContextProvider>

    <Footer />
  </div>
);

export default Login;
