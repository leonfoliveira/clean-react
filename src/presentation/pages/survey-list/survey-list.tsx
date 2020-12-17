/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import { Footer, Header, Icon, IconName } from '@/presentation/components';

import Styles from './survey-list-styles.scss';

const SurveyList: React.FC = () => (
  <div className={Styles.surveyListWrap}>
    <Header />
    <div className={Styles.contentWrap}>
      <h2>Enquetes</h2>
      <ul>
        <li>
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
        <li>
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
        <li>
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
      </ul>
    </div>
    <Footer />
  </div>
);

export default SurveyList;
