import React from 'react';
import FlipMove from 'react-flip-move';

import { Footer, Header, Loading } from '@/presentation/components';

import Styles from './survey-result-styles.scss';

const SurveyResult: React.FC = () => (
  <div className={Styles.surveyResultWrap}>
    <Header />
    <div className={Styles.contentWrap} onClick={() => {}}>
      <h2>Qual é seu framework web favorito?</h2>
      <FlipMove className={Styles.answersList}>
        <li>
          <img src="http://fordevs.herokuapp.com/static/img/logo-react.png" />
          <span className={Styles.answer}>ReactJS</span>
          <span className={Styles.percent}>50%</span>
        </li>

        <li className={Styles.active}>
          <img src="http://fordevs.herokuapp.com/static/img/logo-react.png" />
          <span className={Styles.answer}>ReactJS</span>
          <span className={Styles.percent}>50%</span>
        </li>

        <li>
          <img src="http://fordevs.herokuapp.com/static/img/logo-react.png" />
          <span className={Styles.answer}>ReactJS</span>
          <span className={Styles.percent}>50%</span>
        </li>
      </FlipMove>
      <button type="button">Voltar</button>
      {false && <Loading />}
    </div>
    <Footer />
  </div>
);

export default SurveyResult;
