import React from 'react';
import * as styles from './col.module.css';

const Col = ({ children, ...props }) => (
  <div {...props} className={styles.Col}>
    {children}
  </div>
);

export default Col;
