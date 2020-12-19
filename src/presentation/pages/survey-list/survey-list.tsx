import React, { useEffect, useState } from 'react';

import { Error, Footer, Header } from '@/presentation/components';
import { LoadSurveyList } from '@/domain/usecases';
import { SurveyListitem } from '@/presentation/pages/survey-list/components';
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

  const reload = () => {
    setState((old) => ({ surveys: [], error: '', reload: !old.reload }));
  };

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap} onClick={() => {}}>
        <h2>Enquetes</h2>
        <SurveyContext.Provider value={{ state, setState }}>
          {state.error ? <Error error={state.error} handleClick={reload} /> : <SurveyListitem />}
        </SurveyContext.Provider>
      </div>
      <Footer />
    </div>
  );
};

export default SurveyList;
