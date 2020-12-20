import React from 'react';
import { useHistory } from 'react-router-dom';
import FlipMove from 'react-flip-move';

import { Calendar } from '@/presentation/components';
import { LoadSurveyResult } from '@/domain/usecases';

import Styles from './result-styles.scss';

type Props = {
  surveyResult: LoadSurveyResult.Model;
};

const Result: React.FC<Props> = ({ surveyResult }) => {
  const { back } = useHistory();

  return (
    <>
      <hgroup>
        <Calendar className={Styles.calendarWrap} date={surveyResult.date} />
        <h2 data-testid="question">{surveyResult.question}</h2>
      </hgroup>
      <FlipMove className={Styles.answersList} data-testid="answers">
        {surveyResult.answers.map((answer) => (
          <li
            key={answer.answer}
            className={answer.isCurrentAccountAnswer ? Styles.active : ''}
            data-testid="answer-wrap"
          >
            {answer.image && <img src={answer.image} alt={answer.answer} data-testid="image" />}
            <span className={Styles.answer} data-testid="answer">
              {answer.answer}
            </span>
            <span className={Styles.percent} data-testid="percent">
              {`${answer.percent}%`}
            </span>
          </li>
        ))}
      </FlipMove>
      <button className={Styles.button} type="button" onClick={back} data-testid="back-button">
        Voltar
      </button>
    </>
  );
};

export default Result;
