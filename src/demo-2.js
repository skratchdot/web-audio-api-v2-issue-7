import React, { useState, useEffect, useRef } from 'react';
import AnalyserChart from './analyser-chart';
import Col from './col';
import Range from './range';
import Row from './row';
import * as styles from './demo-2.module.css';

const Demo2 = () => {
  const contextRef = useRef();
  const analyserRef = useRef();
  const analyserLfoRef = useRef();
  const gainRef = useRef();
  const [workletLoaded, setWorkletLoaded] = useState(false);
  const [workletError, setWorkletError] = useState();
  const [gain, setGain] = useState(0);
  const scCode = `{ Pulse.ar(200, SinOsc.ar(0.5).range(0, 1)) }.play`;

  useEffect(() => {
    if (gainRef.current && contextRef.current) {
      gainRef.current.gain.setValueAtTime(gain, contextRef.current.currentTime);
    }
  }, [gain]);

  useEffect(() => {
    const context = new AudioContext();
    (async () => {
      try {
        await context.audioWorklet.addModule('pulse-oscillator.js');
        analyserRef.current = new AnalyserNode(context, { smoothingTimeConstant: 0 });
        analyserLfoRef.current = new AnalyserNode(context, { smoothingTimeConstant: 0 });
        gainRef.current = new GainNode(context, { gain: 0 });

        // create lfo (oscillates between 0-1 at 0.2 freq)
        const lfoOsc = new OscillatorNode(context, { frequency: 0.5 });
        const lfoConstant = new ConstantSourceNode(context);
        const lfoGain = new GainNode(context, { gain: 0.5 });

        // create pulse
        const pulse = new AudioWorkletNode(context, 'pulse-oscillator');
        pulse.parameters
          .get('frequency')
          .setValueAtTime(200, context.currentTime);

        // connect nodes
        lfoOsc.connect(lfoGain);
        lfoConstant.connect(lfoGain);
        pulse.connect(analyserRef.current);
        pulse.connect(gainRef.current);
        gainRef.current.connect(context.destination);

        // start nodes
        lfoOsc.start();
        lfoConstant.start();
        lfoGain.connect(pulse.parameters.get('pulseWidth'));
        lfoGain.connect(analyserLfoRef.current);

        setWorkletLoaded(true);
      } catch (err) {
        console.error(err);
        setWorkletError(err.message);
      }
    })();
    contextRef.current = context;
    return () => {
      contextRef.current.close();
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
          The goal if this demo is to emulate the following SuperCollider code
          using the webaudio api
          <pre className={styles.pre}>
            <code className={styles.code}>{scCode}</code>
          </pre>
        </Col>
      </Row>
      <Row>
        <Col>
          <Range
            name="gain"
            value={gain}
            min={0}
            max={1}
            step={0.001}
            setter={setGain}
            presets={[0, 0.3, 0.5, 0.8, 1]}
          />
        </Col>
      </Row>
      <h2>output of our pulse oscillator after connecting lfo</h2>
      <Row>
        <Col>
          <AnalyserChart analyser={analyserRef.current} chartType="waveform" />
        </Col>
        <Col>
          <AnalyserChart analyser={analyserRef.current} chartType="fft" />
        </Col>
      </Row>
      <h2>lfo output (current pulseWidth value)</h2>
      <Row>
        <Col>
          <AnalyserChart analyser={analyserLfoRef.current} chartType="waveform" />
        </Col>
        <Col>
          <AnalyserChart analyser={analyserLfoRef.current} chartType="fft" />
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
