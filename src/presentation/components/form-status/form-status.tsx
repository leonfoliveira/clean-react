import React from 'react';

import Spinner from '@/presentation/components/spinner/spinner';

import Styles from './form-status-styles.scss';

type Props = {
  state: any;
};

const FormStatus: React.FC<Props> = ({ state }) => (
  <div className={Styles.errorWrap} data-testid="error-wrap">
    {state.isLoading && <Spinner className={Styles.spinner} />}
    {state.mainError && (
      <span className={Styles.error} data-testid="main-error">
        {state.mainError}
      </span>
    )}
  </div>
);

export default FormStatus;
