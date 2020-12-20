import React from 'react';
import { useHistory } from 'react-router-dom';
import FlipMove from 'react-flip-move';

import { Calendar } from '@/presentation/components';
import { LoadSurveyResult } from '@/domain/usecases';
import { SurveyResultAnswer } from '@/presentation/pages/survey-result/components';

import Styles from './result-styles.scss';

type Props = {
  surveyResult: LoadSurveyResult.Model;
};

const Result: React.FC<Props> = ({ surveyResult }) => {
  const { go } = useHistory();

  return (
    <>
      <hgroup>
        <Calendar className={Styles.calendarWrap} date={surveyResult.date} />
        <h2 data-testid="question">{surveyResult.question}</h2>
      </hgroup>
      <FlipMove className={Styles.answersList} data-testid="answers">
        <>
          {surveyResult.answers.map((answer) => (
            <SurveyResultAnswer key={answer.answer} answer={answer} />
          ))}
        </>
      </FlipMove>
      <button
        className={Styles.button}
        type="button"
        onClick={() => go(-1)}
        data-testid="back-button"
      >
        Voltar
      </button>
    </>
  );
};

export default Result;
