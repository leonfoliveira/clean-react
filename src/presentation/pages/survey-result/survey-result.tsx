import React, { useEffect, useState } from 'react';
import FlipMove from 'react-flip-move';

import { Calendar, Error, Footer, Header, Loading } from '@/presentation/components';
import { LoadSurveyResult } from '@/domain/usecases';

import Styles from './survey-result-styles.scss';

type Props = {
  loadSurveyResult: LoadSurveyResult;
};

const SurveyResult: React.FC<Props> = ({ loadSurveyResult }) => {
  const [state, setState] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model,
  });

  useEffect(() => {
    loadSurveyResult
      .load()
      .then((surveyResult) =>
        setState((old) => ({
          ...old,
          surveyResult,
        })),
      )
      .catch();
  }, []);

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
        {state.error && <Error error={state.error} handleClick={() => {}} />}
      </div>
      <Footer />
    </div>
  );
};

export default SurveyResult;
