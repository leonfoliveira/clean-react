import React from 'react';

import { useFormContext } from '@/presentation/contexts/form/form-context';

import Spinner from '@/presentation/components/spinner/spinner';

import Styles from './form-status-styles.scss';

const FormStatus: React.FC = () => {
  const {
    state: { isLoading, mainError },
  } = useFormContext();

  return (
    <div className={Styles.errorWrap} data-testid="error-wrap">
      {isLoading && <Spinner className={Styles.spinner} />}
      {mainError && <span className={Styles.error}>Erro</span>}
    </div>
  );
};

export default FormStatus;
