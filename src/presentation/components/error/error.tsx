import React from 'react';

import Styles from './error-styles.scss';

type Props = {
  error: string;
  handleClick: () => void;
};

const Error: React.FC<Props> = ({ error, handleClick }) => (
  <div className={Styles.errorWrap}>
    <span data-testid="error">{error}</span>
    <button type="button" onClick={handleClick} data-testid="reload">
      Tentar Novamente
    </button>
  </div>
);

export default Error;
