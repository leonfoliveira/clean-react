import React from 'react';

import { LoginHeader, Input, FormStatus, Footer } from '@/presentation/components';

import Styles from './login-styles.scss';

const Login: React.FC = () => (
  <div className={Styles.login}>
    <LoginHeader />
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
  </div>
);

export default Login;
