/* globals currentFrame, currentTime, sampleRate, registerProcessor */

dfdfd;

// a few default values
const DEFAULT_FREQUENCY = 440;
const DEFAULT_DETUNE = 0;
const DEFAULT_PULSE_WIDTH = 0.5;

/**
 * helper function for getting param values
 *
 * @param {*} param
 */
const paramGetter = (param) =>
  param.length > 1 ? (n) => param[n] : () => param[0];

/**
 * A Pulse Oscillator with a pulseWidth audioParam.  It should behave
 * very similar to the "square" wave oscillator with the caveat that
 * pulseWidth can be set.
 *
 * https://github.com/WebAudio/web-audio-api-v2/issues/7
 *
 * @class PulseOscillator
 * @extends AudioWorkletProcessor
 */
class PulseOscillator extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'frequency',
        defaultValue: DEFAULT_FREQUENCY,
        minValue: -0.5 * sampleRate,
        maxValue: 0.5 * sampleRate,
        automationRate: 'a-rate',
      },
      {
        name: 'detune',
        defaultValue: DEFAULT_DETUNE,
        minValue: -153600,
        maxValue: 153600,
        automationRate: 'a-rate',
      },
      {
        name: 'pulseWidth',
        defaultValue: DEFAULT_PULSE_WIDTH,
        minValue: 0,
        maxValue: 1,
        automationRate: 'a-rate',
      },
    ];
  }

  constructor() {
    super();
    this.pos = 0;
    this.minPhase = -1;
    this.maxPhase = 1;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const getFrequency = paramGetter(parameters.frequency);
    const getDetune = paramGetter(parameters.detune);
    const getPulseWidth = paramGetter(parameters.pulseWidth);

    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        const frequency = getFrequency(i);
        const detune = getDetune(i);
        const pulseWidth = getPulseWidth(i);
        const freq = frequency * Math.pow(2, detune / 1200);
        const r = this.pos % 1; // get remainder (a value between 0 and 1)
        const phase = r < 0 ? 0 - r : r; // handle negative frequencies
        // set output value
        channel[i] = phase < pulseWidth ? this.minPhase : this.maxPhase;
        // increase phase
        this.pos += freq / sampleRate;
      }
    });

    return true;
  }
}

registerProcessor('pulse-oscillator', PulseOscillator);
