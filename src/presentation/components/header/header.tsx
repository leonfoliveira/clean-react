/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { ApiContext } from '@/presentation/contexts';
import { Logo } from '@/presentation/components';

import Styles from './header-styles.scss';

const Header: React.FC = () => {
  const history = useHistory();
  const { setCurrentAccount } = useContext(ApiContext);

  const logout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault();

    setCurrentAccount(null);
    history.replace('/login');
  };

  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span>Leonardo</span>
          <a href="#" onClick={logout} data-testid="logout">
            Sair
          </a>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
