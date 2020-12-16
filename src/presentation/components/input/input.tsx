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
    <div
      className={Styles.inputWrap}
      data-status={error ? 'invalid' : 'valid'}
      data-testid={`${props.name}-wrap`}
    >
      <label
        htmlFor={props.id || props.name}
        title={error && error}
        data-testid={`${props.name}-label`}
      >
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
    </div>
  );
};

export default Input;
