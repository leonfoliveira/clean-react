import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Footer, Header } from '@/presentation/components';
import { LoadSurveyList } from '@/domain/usecases';
import { AccessDeniedError } from '@/domain/errors';
import { SurveyError, SurveyListitem } from '@/presentation/pages/survey-list/components';
import SurveyContext from '@/presentation/pages/survey-list/contexts/survey-context';
import { ApiContext } from '@/presentation/contexts';

import Styles from './survey-list-styles.scss';

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  const history = useHistory();
  const { setCurrentAccount } = useContext(ApiContext);
  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.Model[],
    error: '',
    reload: false,
  });

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((surveys) => setState({ ...state, surveys }))
      .catch((error) => {
        if (error instanceof AccessDeniedError) {
          setCurrentAccount(null);
          history.replace('/login');
        } else {
          setState({ ...state, error: error.message });
        }
      });
  }, [state.reload]);

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap} onClick={() => {}}>
        <h2>Enquetes</h2>
        <SurveyContext.Provider value={{ state, setState }}>
          {state.error ? <SurveyError /> : <SurveyListitem />}
        </SurveyContext.Provider>
      </div>
      <Footer />
    </div>
  );
};

export default SurveyList;
