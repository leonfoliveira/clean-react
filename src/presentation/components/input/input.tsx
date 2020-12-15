import React, { useContext } from 'react';

import Context from '@/presentation/contexts/form-context';

import Styles from './input-styles.scss';

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const Input: React.FC<Props> = (props) => {
  const { state, setState } = useContext(Context);
  const error = state[`${props.name}Error`];

  const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  return (
    <div className={Styles.inputWrap}>
      <label htmlFor={props.id || props.name}>
        <input
          id={props.name}
          {...props}
          placeholder=" "
          readOnly
          onFocus={(event) => {
            // eslint-disable-next-line no-param-reassign
            event.target.readOnly = false;
          }}
          onChange={handleChange}
          data-testid={props.name}
        />
        <span>{props.placeholder}</span>
      </label>
      <span
        className={Styles.status}
        role="img"
        aria-label="invalid"
        title={error || 'Tudo Certo!'}
        data-testid={`${props.name}-status`}
      >
        {error ? '🔴' : '🟢'}
      </span>
    </div>
  );
};

export default Input;
