import React from 'react';
import { useRecoilState } from 'recoil';

import { SubmitButtonBase } from '@/presentation/components';
import { loginState } from './atoms';

type Props = React.HTMLProps<HTMLButtonElement> & {
  text: string;
};

const SubmitButton: React.FC<Props> = ({ text, ...props }) => {
  const [state] = useRecoilState(loginState);

  return <SubmitButtonBase {...props} text={text} state={state} />;
};

export default SubmitButton;
