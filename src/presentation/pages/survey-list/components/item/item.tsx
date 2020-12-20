import React from 'react';
import { Link } from 'react-router-dom';

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
      <Link to={`/surveys/${survey.id}`} data-testid="link">
        Ver Resultado
      </Link>
    </footer>
  </li>
);

export default SurveyItem;
