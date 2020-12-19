import React from 'react';

import { Calendar, Icon, IconName } from '@/presentation/components';
import { LoadSurveyList } from '@/domain/usecases';

import Styles from './item-styles.scss';

type Props = {
  survey: LoadSurveyList.Model;
};

const SurveyItem: React.FC<Props> = ({ survey }) => (
  <li className={Styles.surveyItemWrap}>
    <div className={Styles.surveyContent}>
      <Icon
        className={Styles.iconWrap}
        iconName={survey.didAnswer ? IconName.thumbUp : IconName.thumbDown}
      />
      <Calendar date={survey.date} className={Styles.calendarWrap} />
      <p data-testid="question">{survey.question}</p>
    </div>
    <footer>
      <button type="button">Ver Resultado</button>
    </footer>
  </li>
);

export default SurveyItem;
