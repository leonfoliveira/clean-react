/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import { Footer, Logo } from '@/presentation/components';

import Styles from './survey-list-styles.scss';

const SurveyList: React.FC = () => (
  <div className={Styles.surveyListWrap}>
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span>Leonardo</span>
          <a href="#">Sair</a>
        </div>
      </div>
    </header>
    <div className={Styles.contentWrap}>
      <h2>Enquetes</h2>
      <ul>
        <li>
          <div className={Styles.surveyContent}>
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
