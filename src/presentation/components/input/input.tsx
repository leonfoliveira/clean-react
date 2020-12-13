import React from 'react';

import { useFormContext } from '@/presentation/contexts/form/form-context';

import Styles from './input-styles.scss';

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
const Input: React.FC<Props> = (props) => {
  const { state, setState } = useFormContext();
  const error = state[`${props.name}Error`];

  const enableInput = (event: React.FocusEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-param-reassign
    event.target.readOnly = false;
  };

  const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const getStatus = (): string => (error ? '🔴' : '🟢');

  const getTitle = (): string => error || 'Tudo Certo!';

  return (
    <div className={Styles.inputWrap}>
      <input {...props} readOnly onFocus={enableInput} onChange={handleChange} data-testid={props.name} />
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
