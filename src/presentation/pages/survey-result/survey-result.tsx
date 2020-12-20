import React, { useEffect, useState } from 'react';

import { Error, Footer, Header, Loading } from '@/presentation/components';
import { LoadSurveyResult } from '@/domain/usecases';
import { useErrorHandler } from '@/presentation/hooks';
import { SurveyResultData } from './components';

import Styles from './survey-result-styles.scss';

type Props = {
  loadSurveyResult: LoadSurveyResult;
};

const SurveyResult: React.FC<Props> = ({ loadSurveyResult }) => {
  const [state, setState] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model,
    reload: false,
  });

  const handleError = useErrorHandler((error: Error) =>
    setState((old) => ({ ...old, isLoading: false, surveyResult: null, error: error.message })),
  );

  useEffect(() => {
    loadSurveyResult
      .load()
      .then((surveyResult) =>
        setState((old) => ({
          ...old,
          surveyResult,
        })),
      )
      .catch(handleError);
  }, [state.reload]);

  const reload = () => {
    setState((old) => ({ isLoading: true, surveyResult: null, error: '', reload: !old.reload }));
  };

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <div className={Styles.contentWrap} data-testid="survey-result">
        {state.surveyResult && <SurveyResultData surveyResult={state.surveyResult} />}
        {state.isLoading && <Loading />}
        {state.error && <Error error={state.error} handleClick={reload} />}
      </div>
      <Footer />
    </div>
  );
};

export default SurveyResult;
