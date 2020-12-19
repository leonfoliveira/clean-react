import React, { useContext } from 'react';

import SurveyContext from '@/presentation/pages/survey-list/contexts/survey-context';

import Styles from './error-styles.scss';

const Error: React.FC = () => {
  const { state, setState } = useContext(SurveyContext);

  const reload = (): void => {
    setState((old) => ({ surveys: [], error: '', reload: !old.reload }));
  };

  return (
    <div className={Styles.errorWrap}>
      <span data-testid="error">{state.error}</span>
      <button type="button" onClick={reload} data-testid="reload">
        Tentar Novamente
      </button>
    </div>
  );
};

export default Error;
