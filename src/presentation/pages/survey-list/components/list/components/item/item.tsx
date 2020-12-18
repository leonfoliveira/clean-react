import React from 'react';

import { SurveyModel } from '@/domain/models';
import { Icon, IconName } from '@/presentation/components';

import Styles from './survey-item-styles.scss';

type Props = {
  survey: SurveyModel;
};

const SurveyItem: React.FC<Props> = ({ survey }) => (
  <li className={Styles.surveyItemWrap}>
    <div className={Styles.surveyContent}>
      <Icon
        className={Styles.iconWrap}
        iconName={survey.didAnswer ? IconName.thumbUp : IconName.thumbDown}
      />
      <time>
        <span className={Styles.day} data-testid="day">
          {survey.date.getDate().toString().padStart(2, '0')}
        </span>
        <span className={Styles.month} data-testid="month">
          {survey.date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
        </span>
        <span className={Styles.year} data-testid="year">
          {survey.date.getFullYear()}
        </span>
      </time>
      <p data-testid="question">{survey.question}</p>
    </div>
    <footer>
      <button type="button">Ver Resultado</button>
    </footer>
  </li>
);

export default SurveyItem;