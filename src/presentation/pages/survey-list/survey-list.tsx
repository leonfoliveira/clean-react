/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import { Footer, Header } from '@/presentation/components';
import { SurveyItemEmpty } from '@/presentation/pages/survey-list/components';

import Styles from './survey-list-styles.scss';

const SurveyList: React.FC = () => (
  <div className={Styles.surveyListWrap}>
    <Header />
    <div className={Styles.contentWrap}>
      <h2>Enquetes</h2>
      <ul data-testid="survey-list">
        <SurveyItemEmpty />
      </ul>
    </div>
    <Footer />
  </div>
);

export default SurveyList;
