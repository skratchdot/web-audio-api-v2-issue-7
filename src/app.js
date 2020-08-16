import React, { useState } from 'react';
import Col from './col';
import GithubCorner from 'react-github-corner';
import Row from './row';
import * as styles from './app.module.css';
import { name as packageName } from '../package.json';
import Demo1 from './demo-1';
import Demo2 from './demo-2';

const App = () => {
  const [demoName, setDemoName] = useState('demo1');

  let demo;
  if (demoName === 'demo1') {
    demo = <Demo1 />;
  } else if (demoName === 'demo2') {
    demo = <Demo2 />;
  }

  return (
    <div className={styles.App}>
      <Row>
        <Col>
          <h1>{packageName}</h1>
        </Col>
        <Col style={{ alignSelf: 'center' }}>
          {['demo1', 'demo2'].map((d) => (
            <button key={d} disabled={demoName === d} onClick={() => setDemoName(d)}>
              {d}
            </button>
          ))}
        </Col>
      </Row>
      <Row>
        <Col>{demo}</Col>
      </Row>
      <GithubCorner href={`https://github.com/skratchdot/${packageName}`} />
    </div>
  );
};

export default App;
