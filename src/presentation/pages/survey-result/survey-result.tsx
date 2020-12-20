import React, { useEffect, useState } from 'react';

import { Error, Footer, Header, Loading } from '@/presentation/components';
import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases';
import { useErrorHandler } from '@/presentation/hooks';
import {
  SurveyResultData,
  SurveyResultContext,
} from '@/presentation/pages/survey-result/components';

import Styles from './survey-result-styles.scss';

type Props = {
  loadSurveyResult: LoadSurveyResult;
  saveSurveyResult: SaveSurveyResult;
};

const SurveyResult: React.FC<Props> = ({ loadSurveyResult, saveSurveyResult }) => {
  const [state, setState] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model,
    reload: false,
  });

  const handleError = useErrorHandler((error: Error) =>
    setState((old) => ({ ...old, surveyResult: null, error: error.message, isLoading: false })),
  );

  useEffect(() => {
    loadSurveyResult
      .load()
      .then((surveyResult) =>
        setState((old) => ({
          ...old,
          isLoading: false,
          surveyResult,
        })),
      )
      .catch(handleError);
  }, [state.reload]);

  const reload = () => {
    setState((old) => ({ ...old, surveyResult: null, error: '', reload: !old.reload }));
  };

  const onAnswer = (answer: string): void => {
    setState((old) => ({ ...old, isLoading: true }));
    saveSurveyResult.save({ answer }).then().catch(handleError);
  };

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <SurveyResultContext.Provider value={{ onAnswer }}>
        <div className={Styles.contentWrap} data-testid="survey-result">
          {state.surveyResult && <SurveyResultData surveyResult={state.surveyResult} />}
          {state.isLoading && <Loading />}
          {state.error && <Error error={state.error} handleClick={reload} />}
        </div>
      </SurveyResultContext.Provider>
      <Footer />
    </div>
  );
};

export default SurveyResult;
