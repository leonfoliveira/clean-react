import React from 'react';

import { useLoginContext } from '@/presentation/pages/login/login-context';

import Spinner from '@/presentation/components/spinner/spinner';

import Styles from './form-status-styles.scss';

const FormStatus: React.FC = () => {
  const {
    state: { isLoading, mainError },
  } = useLoginContext();

  return (
    <div className={Styles.errorWrap} data-testid="error-wrap">
      {isLoading && <Spinner className={Styles.spinner} />}
      {mainError && <span className={Styles.error}>Erro</span>}
    </div>
  );
};

export default FormStatus;
