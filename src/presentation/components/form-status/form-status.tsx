import React, { useContext } from 'react';

import Context from '@/presentation/contexts/form/form-context';

import Spinner from '@/presentation/components/spinner/spinner';

import Styles from './form-status-styles.scss';

const FormStatus: React.FC = () => {
  const { isLoading, errorMessage } = useContext(Context);

  return (
    <div className={Styles.errorWrap} data-testid="error-wrap">
      {isLoading && <Spinner className={Styles.spinner} />}
      {errorMessage && <span className={Styles.error}>Erro</span>}
    </div>
  );
};

export default FormStatus;
