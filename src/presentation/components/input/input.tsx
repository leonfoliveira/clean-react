import React from 'react';

import { useFormContext } from '@/presentation/contexts/form/form-context';

import Styles from './input-styles.scss';

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
const Input: React.FC<Props> = (props) => {
  const { errorState } = useFormContext();
  const error = errorState[`${props.name}`];

  const enableInput = (event: React.FocusEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-param-reassign
    event.target.readOnly = false;
  };

  const getStatus = (): string => '🔴';

  const getTitle = (): string => error;

  return (
    <div className={Styles.inputWrap}>
      <input {...props} readOnly onFocus={enableInput} />
      <span
        className={Styles.status}
        role="img"
        aria-label="invalid"
        title={getTitle()}
        data-testid={`${props.name}-status`}
      >
        {getStatus()}
      </span>
    </div>
  );
};

export default Input;
