import React from 'react';

type Props = React.HTMLProps<HTMLButtonElement> & {
  text: string;
  state: any;
};
const SubmitButton: React.FC<Props> = ({ text, state, ...props }) => (
  <button {...props} type="submit" disabled={state.isFormInvalid} data-testid="submit">
    {text}
  </button>
);

export default SubmitButton;
