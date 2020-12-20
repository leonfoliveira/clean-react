import React, { useEffect } from 'react';

import { Error, Footer, Header, Loading } from '@/presentation/components';
import { LoadSurveyResult, SaveSurveyResult } from '@/domain/usecases';
import { useErrorHandler } from '@/presentation/hooks';
import {
  SurveyResultData,
  surveyResultState,
  onSurveyAnswerState,
} from '@/presentation/pages/survey-result/components';
import { useRecoilState, useSetRecoilState } from 'recoil';

import Styles from './survey-result-styles.scss';

type Props = {
  loadSurveyResult: LoadSurveyResult;
  saveSurveyResult: SaveSurveyResult;
};

const SurveyResult: React.FC<Props> = ({ loadSurveyResult, saveSurveyResult }) => {
  const [state, setState] = useRecoilState(surveyResultState);
  const setOnAnswer = useSetRecoilState(onSurveyAnswerState);

  const handleError = useErrorHandler((error: Error) =>
    setState((old) => ({ ...old, surveyResult: null, error: error.message, isLoading: false })),
  );

  useEffect(() => {
    loadSurveyResult
      .load()
      .then((surveyResult) => setState((old) => ({ ...old, surveyResult })))
      .catch(handleError);
  }, [state.reload]);

  const onAnswer = (answer: string): void => {
    if (state.isLoading) {
      return;
    }
    setState((old) => ({ ...old, isLoading: true }));
    saveSurveyResult
      .save({ answer })
      .then((surveyResult) => setState((old) => ({ ...old, isLoading: false, surveyResult })))
      .catch(handleError);
  };

  useEffect(() => setOnAnswer({ onAnswer }), []);

  const reload = () => {
    setState((old) => ({ ...old, surveyResult: null, error: '', reload: !old.reload }));
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
