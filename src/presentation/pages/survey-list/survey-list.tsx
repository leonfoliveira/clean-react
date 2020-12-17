import React, { useEffect } from 'react';

import { Footer, Header } from '@/presentation/components';
import { SurveyItemEmpty } from '@/presentation/pages/survey-list/components';
import { LoadSurveyList } from '@/domain/usecases';

import Styles from './survey-list-styles.scss';

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  useEffect(() => {
    (async () => {
      loadSurveyList.loadAll();
    })();
  }, []);

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap} onClick={() => {}}>
        <h2>Enquetes</h2>
        <ul data-testid="survey-list">
          <SurveyItemEmpty />
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default SurveyList;
