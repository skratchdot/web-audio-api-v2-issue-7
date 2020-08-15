import React, { useState, useEffect } from 'react';
import { FFT } from 'dsp.js';
import AnalyserChart from './analyser-chart';
import Buttons from './buttons';
import Col from './col';
import GithubCorner from 'react-github-corner';
import PulseWidthChart from './pulse-width-chart';
import Range from './range';
import Row from './row';
import * as styles from './app.module.css';
import { name as packageName } from '../package.json';

// defaults
const DEFAULT_FREQUENCY = 440;
const DEFAULT_DETUNE = 0;
const DEFAULT_PULSE_WITDH = 0.5;
const DEFAULT_GAIN = 0;
const WAVETABLE_LENGTH = Math.pow(2, 12);
const TYPES = {
  STOPPED: 'stopped',
  WORKLET: 'worklet',
  CUSTOM: 'custom',
  SQUARE: 'square',
};

// setup audio graph
const ac = new AudioContext();

// main gain
const gainMain = new GainNode(ac, { gain: DEFAULT_GAIN });
gainMain.connect(ac.destination);

// square
const oscSquare = new OscillatorNode(ac, {
  detune: DEFAULT_DETUNE,
  frequency: DEFAULT_FREQUENCY,
  type: 'square',
});
const analyserSquare = new AnalyserNode(ac, { smoothingTimeConstant: 0 });
const gainSquare = new GainNode(ac, { gain: 0 });
oscSquare.connect(gainSquare);
gainSquare.connect(gainMain);
oscSquare.connect(analyserSquare);
oscSquare.start();

// custom
const oscCustom = new OscillatorNode(ac, {
  detune: DEFAULT_DETUNE,
  frequency: DEFAULT_FREQUENCY,
});
const analyserCustom = new AnalyserNode(ac, { smoothingTimeConstant: 0 });
const gainCustom = new GainNode(ac, { gain: 0 });
oscCustom.connect(gainCustom);
gainCustom.connect(gainMain);
oscCustom.connect(analyserCustom);
oscCustom.start();

// worklet variables will be populated inside our App component
let oscWorklet, gainWorklet, analyserWorklet;

const App = () => {
  // settings
  const [frequency, setFrequency] = useState(DEFAULT_FREQUENCY);
  const [detune, setDetune] = useState(DEFAULT_DETUNE);
  const [pulseWidth, setPulseWidth] = useState(DEFAULT_PULSE_WITDH);
  const [gain, setGain] = useState(DEFAULT_GAIN);
  const [playType, setPlayType] = useState(TYPES.STOPPED);
  const [workletLoaded, setWorkletLoaded] = useState(false);
  const [workletError, setWorkletError] = useState();

  const updatePeriodicWave = () => {
    // set periodic wave
    const pulsePoint = WAVETABLE_LENGTH * pulseWidth;
    const wavetable = [];
    for (let i = 0; i < WAVETABLE_LENGTH; i++) {
      wavetable[i] = i < pulsePoint ? -1 : 1;
    }
    var fft = new FFT(wavetable.length);
    fft.forward(wavetable);
    const wave = ac.createPeriodicWave(
      new Float32Array(fft.real),
      new Float32Array(fft.imag),
      { disableNormalization: false }
    );
    oscCustom.setPeriodicWave(wave);
  };

  useEffect(() => {
    oscCustom.frequency.setValueAtTime(frequency, ac.currentTime);
    oscSquare.frequency.setValueAtTime(frequency, ac.currentTime);
    oscWorklet &&
      oscWorklet.parameters
        .get('frequency')
        .setValueAtTime(frequency, ac.currentTime);
  }, [frequency]);

  useEffect(() => {
    oscCustom.detune.setValueAtTime(detune, ac.currentTime);
    oscSquare.detune.setValueAtTime(detune, ac.currentTime);
    oscWorklet &&
      oscWorklet.parameters
        .get('detune')
        .setValueAtTime(detune, ac.currentTime);
  }, [detune]);

  useEffect(() => {
    updatePeriodicWave();
    oscWorklet &&
      oscWorklet.parameters
        .get('pulseWidth')
        .setValueAtTime(pulseWidth, ac.currentTime);
  }, [pulseWidth]); // eslint-disable-line

  useEffect(() => {
    gainMain.gain.value = gain;
  }, [gain]);

  useEffect(() => {
    if (playType !== TYPES.STOPPED && ac.state === 'suspended') {
      ac.resume();
    }
    if (playType === TYPES.STOPPED) {
      ac.suspend();
    } else if (playType === TYPES.WORKLET) {
      gainCustom.gain.setValueAtTime(0, ac.currentTime);
      gainSquare.gain.setValueAtTime(0, ac.currentTime);
      gainWorklet && gainWorklet.gain.setValueAtTime(1, ac.currentTime);
    } else if (playType === TYPES.CUSTOM) {
      updatePeriodicWave();
      gainCustom.gain.setValueAtTime(1, ac.currentTime);
      gainSquare.gain.setValueAtTime(0, ac.currentTime);
      gainWorklet && gainWorklet.gain.setValueAtTime(0, ac.currentTime);
    } else if (playType === TYPES.SQUARE) {
      gainCustom.gain.setValueAtTime(0, ac.currentTime);
      gainSquare.gain.setValueAtTime(1, ac.currentTime);
      gainWorklet && gainWorklet.gain.setValueAtTime(0, ac.currentTime);
    }
  }, [playType]); // eslint-disable-line

  useEffect(() => {
    ac.audioWorklet
      .addModule('pulse-oscillator.js')
      .then(() => {
        oscWorklet = new AudioWorkletNode(ac, 'pulse-oscillator');
        analyserWorklet = new AnalyserNode(ac, { smoothingTimeConstant: 0 });
        gainWorklet = new GainNode(ac, { gain: 0 });
        oscWorklet.connect(analyserWorklet);
        oscWorklet.connect(gainWorklet);
        gainWorklet.connect(gainMain);
        setWorkletLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        setWorkletError(err.message);
      });
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
    <div className={styles.App}>
      <Row>
        <Col>
          <h2>App Settings</h2>
          <Range
            name="gain"
            value={gain}
            min={0}
            max={1}
            step={0.001}
            setter={setGain}
            presets={[0, 0.3, 0.5, 0.8, 1]}
          />
          <Buttons
            playType={playType}
            choices={[TYPES.STOPPED, TYPES.WORKLET, TYPES.CUSTOM, TYPES.SQUARE]}
            setPlayType={setPlayType}
          />

          <h2>Pulse Oscillator Settings</h2>
          <Range
            name="frequency"
            value={frequency}
            min={-2000}
            max={2000}
            step={1}
            setter={setFrequency}
            presets={[
              -2000,
              -880,
              -440,
              -220,
              -110,
              -55,
              0,
              55,
              110,
              220,
              440,
              880,
              2000,
            ]}
          />
          <Range
            name="detune"
            value={detune}
            min={-2400}
            max={2400}
            step={1}
            setter={setDetune}
            presets={[-2400, -1200, -600, 0, 600, 1200, 2400]}
          />
          <Range
            name="pulseWidth"
            value={pulseWidth}
            min={0}
            max={1}
            step={0.001}
            setter={setPulseWidth}
            presets={[0, 0.01, 0.25, 0.5, 0.75, 0.99, 1]}
          />
          <br />
          <PulseWidthChart pulseWidth={pulseWidth} numCycles={5} />
        </Col>
        <Col className={styles.Col}>
          <h2>Visualizations</h2>
          <h3>worker</h3>
          <Row>
            <Col>
              <AnalyserChart analyser={analyserWorklet} chartType="waveform" />
            </Col>
            <Col>
              <AnalyserChart analyser={analyserWorklet} chartType="fft" />
            </Col>
          </Row>
          <h3>custom</h3>
          <Row>
            <Col>
              <AnalyserChart analyser={analyserCustom} chartType="waveform" />
            </Col>
            <Col>
              <AnalyserChart analyser={analyserCustom} chartType="fft" />
            </Col>
          </Row>
          <h3>square</h3>
          <Row>
            <Col>
              <AnalyserChart analyser={analyserSquare} chartType="waveform" />
            </Col>
            <Col>
              <AnalyserChart analyser={analyserSquare} chartType="fft" />
            </Col>
          </Row>
        </Col>
      </Row>
      <GithubCorner href={`https://github.com/skratchdot/${packageName}`} />
    </div>
  );
};

export default App;
