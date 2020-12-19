import React, { useEffect, useState } from 'react';

import { Footer, Header } from '@/presentation/components';
import { LoadSurveyList } from '@/domain/usecases';
import { SurveyError, SurveyListitem } from '@/presentation/pages/survey-list/components';
import SurveyContext from '@/presentation/pages/survey-list/contexts/survey-context';

import { useErrorHandler } from '@/presentation/hooks';
import Styles from './survey-list-styles.scss';

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.Model[],
    error: '',
    reload: false,
  });

  const handleError = useErrorHandler((error: Error) =>
    setState((old) => ({ ...old, error: error.message })),
  );

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((surveys) => setState({ ...state, surveys }))
      .catch(handleError);
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
