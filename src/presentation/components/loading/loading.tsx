import React from 'react';

import { Spinner } from '@/presentation/components';

import Styles from './loading-styles.scss';

const Loading: React.FC = () => (
  <div className={Styles.loadingWrap} data-testid="loading">
    <div className={Styles.loading}>
      <span>Aguarde...</span>
      <Spinner className={Styles.spinner} />
    </div>
  </div>
);

export default Loading;
