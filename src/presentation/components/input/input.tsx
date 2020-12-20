import React from 'react';

import Styles from './input-styles.scss';

type Props = React.HTMLProps<HTMLInputElement> & {
  state: any;
  setState: any;
};

const Input: React.FC<Props> = ({ state, setState, ...props }) => {
  const error = state.formErrors[`${props.name}Error`];

  const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
    setState((old) => ({
      ...old,
      formData: { ...old.formData, [event.target.name]: event.target.value },
    }));
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
