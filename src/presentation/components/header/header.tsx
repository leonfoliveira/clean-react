/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo } from 'react';
import { useRecoilValue } from 'recoil';

import { Logo, currentAccountState } from '@/presentation/components';
import { useLogout } from '@/presentation/hooks';

import Styles from './header-styles.scss';

const Header: React.FC = () => {
  const { getCurrentAccount } = useRecoilValue(currentAccountState);

  const logout = useLogout();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault();
    logout();
  };

  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span data-testid="username">{getCurrentAccount().name}</span>
          <a href="#" onClick={handleClick} data-testid="logout">
            Sair
          </a>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
