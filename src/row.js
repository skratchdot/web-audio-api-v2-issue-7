import React from 'react';
import * as styles from './row.module.css';

const Row = ({ children, ...props }) => (
  <div {...props} className={styles.Row}>
    {children}
  </div>
);
export default Row;
