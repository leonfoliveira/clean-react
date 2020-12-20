import React from 'react';

import { SurveyResultAnswerModel } from '@/domain/models';

import { useRecoilValue } from 'recoil';
import Styles from './answer-styles.scss';
import { onSurveyAnswerState } from '../atoms/atoms';

type Props = {
  answer: SurveyResultAnswerModel;
};

const Answer: React.FC<Props> = ({ answer }) => {
  const { onAnswer } = useRecoilValue(onSurveyAnswerState);
  const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>): void => {
    if (event.currentTarget.classList.contains(Styles.active)) {
      return;
    }

    onAnswer(answer.answer);
  };

  return (
    <li
      className={[Styles.answerWrap, answer.isCurrentAccountAnswer ? Styles.active : ''].join(' ')}
      data-testid="answer-wrap"
      onClick={handleClick}
    >
      {answer.image && <img src={answer.image} alt={answer.answer} data-testid="image" />}
      <span className={Styles.answer} data-testid="answer">
        {answer.answer}
      </span>
      <span className={Styles.percent} data-testid="percent">
        {`${answer.percent}%`}
      </span>
    </li>
  );
};

export default Answer;
