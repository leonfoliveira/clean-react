import React from 'react';

import Header from '@/presentation/components/login-header/login-header';
import Input from '@/presentation/components/input/input';
import Spinner from '@/presentation/components/spinner/spinner';
import Footer from '@/presentation/components/footer/footer';

import Styles from './login-styles.scss';

const Login: React.FC = () => (
  <div className={Styles.login}>
    <Header />
    <form className={Styles.form} action="">
      <h2>Login</h2>
      
      <Input type="email" name="email" placeholder="Digite seu email" />
      <Input type="password" name="password" placeholder="Digite sua senha" />

      <button className={Styles.submit} type="submit">
        Entrar
      </button>

      <span className={Styles.link}>Criar conta</span>

      <div className={Styles.errorWrap}>
        <Spinner className={Styles.spinner} />
        <span className={Styles.error}>Erro</span>
      </div>
    </form>
    <Footer />
  </div>
);

export default Login;
