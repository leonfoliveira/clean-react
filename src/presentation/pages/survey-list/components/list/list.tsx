import React, { useContext } from 'react';

import SurveyContext from '@/presentation/pages/survey-list/contexts/survey-context';
import { SurveyItem, SurveyItemEmpty } from './components';

import Styles from './list-styles.scss';

const List: React.FC = () => {
  const { state } = useContext(SurveyContext);

  return (
    <ul className={Styles.listWrap} data-testid="survey-list">
      {state.surveys.length ? (
        state.surveys.map((survey) => <SurveyItem key={survey.id} survey={survey} />)
      ) : (
        <SurveyItemEmpty />
      )}
    </ul>
  );
};

export default List;
