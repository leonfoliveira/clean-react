import { Icon, IconName } from '@/presentation/components';
import React from 'react';

import Styles from './survey-item-styles.scss';

const SurveyItem: React.FC = () => (
  <li className={Styles.surveyItemWrap}>
    <div className={Styles.surveyContent}>
      <Icon className={Styles.iconWrap} iconName={IconName.thumbUp} />
      <time>
        <span className={Styles.day}>05</span>
        <span className={Styles.month}>03</span>
        <span className={Styles.year}>1999</span>
      </time>
      <p>Qual é seu framework web favorito?</p>
    </div>
    <footer>
      <button type="button">Ver Resultado</button>
    </footer>
  </li>
);

export default SurveyItem;
