import React, { useEffect, useState } from 'react';

import { Error, Footer, Header } from '@/presentation/components';
import { LoadSurveyList } from '@/domain/usecases';
import { SurveyListitem } from '@/presentation/pages/survey-list/components';

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
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        {state.error ? (
          <Error error={state.error} handleClick={reload} />
        ) : (
          <SurveyListitem surveys={state.surveys} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SurveyList;
