import React from 'react';
import { useRecoilState } from 'recoil';

import { InputBase } from '@/presentation/components';
import { loginState } from './atoms';

type Props = React.HTMLProps<HTMLInputElement>;

const Input: React.FC<Props> = (props) => {
  const [state, setState] = useRecoilState(loginState);

  return <InputBase {...props} state={state} setState={setState} />;
};

export default Input;
