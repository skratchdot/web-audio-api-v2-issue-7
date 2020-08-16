import React, { useState, useEffect, useRef } from 'react';
import { FFT } from 'dsp.js';
import AnalyserChart from './analyser-chart';
import Buttons from './buttons';
import Col from './col';
import PulseWidthChart from './pulse-width-chart';
import Range from './range';
import Row from './row';
import * as styles from './demo-2.module.css';

const Demo2 = () => {
  const ac = useRef();
  const analyser = useRef();
  const [workletLoaded, setWorkletLoaded] = useState(false);
  const [workletError, setWorkletError] = useState();
  const scCode = `{ Pulse.ar(200, SinOsc.kr(0.2).range(0, 1), 0.2) }.play;`;

  useEffect(() => {
    const context = new AudioContext();
    (async () => {
      try {
        await context.audioWorklet.addModule('pulse-oscillator.js');
        const osc = new AudioWorkletNode(context, 'pulse-oscillator');
        osc.parameters
          .get('frequency')
          .setValueAtTime(200, context.currentTime);
        // osc.parameters.get('pulseWidth').setValueAtTime(0.2);
        const gain = new GainNode(context, { gain: 0.2 });
        osc.connect(gain);
        analyser.current = new AnalyserNode(context, {
          smoothingTimeConstant: 0,
        });
        osc.connect(analyser.current);
        setWorkletLoaded(true);
      } catch (err) {
        console.error(err);
        setWorkletError(err.message);
      }
    })();
    ac.current = context;
    return () => {
      ac.current.close();
    };
  }, []);

  if (workletError) {
    return (
      <div className={styles.Loading}>
        an error occured while loading the worklet: {workletError}
      </div>
    );
  }

  if (!workletLoaded) {
    return <div className={styles.Loading}>loading worklet...</div>;
  }

  return (
    <>
      <Row>
        <Col>
          The goal if this demo is to emulate the following SuperCollider code using the webaudio api
          <pre className={styles.pre}>
            <code className={styles.code}>{scCode}</code>
          </pre>
        </Col>
      </Row>
      <Row>
        <Col>
          <button disabled={true}>stop</button>
          <button disabled={true}>start</button>
        </Col>
      </Row>
      <Row>
        <Col style={{ margin: 20, padding: 20 }}>
          The demo is currently incomplete/unfinished
        </Col>
      </Row>
    </>
  );
};

export default Demo2;
