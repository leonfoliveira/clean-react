import React, { useEffect, useState } from 'react';
import FlipMove from 'react-flip-move';

import { Calendar, Error, Footer, Header, Loading } from '@/presentation/components';
import { LoadSurveyResult } from '@/domain/usecases';
import { useErrorHandler } from '@/presentation/hooks';

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
        {state.surveyResult && (
          <>
            <hgroup>
              <Calendar date={state.surveyResult.date} className={Styles.calendarWrap} />
              <h2 data-testid="question">{state.surveyResult.question}</h2>
            </hgroup>
            <FlipMove className={Styles.answersList} data-testid="answers">
              {state.surveyResult.answers.map((answer) => (
                <li
                  key={answer.answer}
                  className={answer.isCurrentAccountAnswer ? Styles.active : ''}
                  data-testid="answer-wrap"
                >
                  {answer.image && (
                    <img src={answer.image} alt={answer.answer} data-testid="image" />
                  )}
                  <span className={Styles.answer} data-testid="answer">
                    {answer.answer}
                  </span>
                  <span className={Styles.percent} data-testid="percent">
                    {`${answer.percent}%`}
                  </span>
                </li>
              ))}
            </FlipMove>
            <button type="button">Voltar</button>
          </>
        )}
        {state.isLoading && <Loading />}
        {state.error && <Error error={state.error} handleClick={reload} />}
      </div>
      <Footer />
    </div>
  );
};

export default SurveyResult;
