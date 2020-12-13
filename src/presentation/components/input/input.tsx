import React from 'react';

import Styles from './input-styles.scss';

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
const Input: React.FC<Props> = (props) => {
  const enableInput = (event: React.FocusEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-param-reassign
    event.target.readOnly = false;
  };

  return (
    <div className={Styles.inputWrap}>
      <input {...props} readOnly onFocus={enableInput} />
      <span className={Styles.status} role="img" aria-label="invalid">
        🔴
      </span>
    </div>
  );
};

export default Input;
