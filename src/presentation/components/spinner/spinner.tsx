import React from 'react';

import Styles from './spinner-styles.scss';

type Props = React.HTMLAttributes<HTMLElement>;
const Spinner: React.FC<Props> = ({ className, ...props }) => (
  <div {...props} className={[Styles.spinner, className].join(' ')} data-testid="spinner">
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default Spinner;
