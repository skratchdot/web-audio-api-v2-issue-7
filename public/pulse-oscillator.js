/* globals currentFrame, currentTime, sampleRate, registerProcessor */

// a few default values
const DEFAULT_FREQUENCY = 440;
const DEFAULT_DETUNE = 0;
const DEFAULT_PULSE_WIDTH = 0.5;
const TWOPI = Math.PI * 2;

/**
 * enforce: -TWOPI < phase < TWOPI
 * @param {*} phase 
 */
const adjustPhase = (phase) => {
  if (phase >= Math.PI) {
    phase -= TWOPI;
  } else if (phase < -Math.PI) {
    phase += TWOPI;
  }
  return phase;
};

// https://github.com/barzamin/polyblep/blob/master/src/lib.rs#L10-L24
const blep = (t, dt) => {
  if (t < dt) {
    t = t / dt;
    return 2 * t - Math.pow(t, 2) - 1;
  } else if (t > (1 - dt)) {
    t = (t - 1) / dt;
    return Math.pow(t, 2) + 2 * t + 1;
  } else {
    return 0;
  }
};

/**
 * helper function for getting audio param values. we either have 1 or 128
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
    this.twoPiOverSr = TWOPI / sampleRate;
    this.freq = 0;
    this.phase = 0;
    this.incr = 0;
    this.dt = 0;
  }
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const getFrequency = paramGetter(parameters.frequency);
    const getDetune = paramGetter(parameters.detune);
    const getPulseWidth = paramGetter(parameters.pulseWidth);

    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        // get our current param values
        const frequency = getFrequency(i);
        const detune = getDetune(i);
        const pulseWidth = getPulseWidth(i);
        // calculate frequency
        const freq = frequency * Math.pow(2, detune / 1200);

        // set new phase
        if (this.freq !== freq) {
          this.freq = freq;
          this.incr = this.twoPiOverSr * freq;
          this.dt = freq / sampleRate;
        }






        // channel[i] = Math.sin(this.phase); // sine
        // channel[i] = this.phase / Math.PI; // sawtooth
        // channel[i] = this.phase <= TWOPI * pulseWidth - Math.PI ? 1 : -1; // square

        // set carrier phase based on current phase and pulseWidth
        const carrierPhase = adjustPhase(this.phase + TWOPI * pulseWidth);
        const sawtooth1 = this.phase / Math.PI;
        const sawtooth2 = carrierPhase / Math.PI;
        const square = sawtooth2 - sawtooth1;


        let t = this.phase / TWOPI;
        const blepValue = square + blep(t, this.dt) - blep((t + 0.5) % 1, this.dt);
        //self.naive_sample(self.wave) + blep(t, self.dt()) - blep((t + 0.5) % 1., self.dt())





        channel[i] = blepValue;


        this.phase += this.incr;
        this.phase = adjustPhase(this.phase);
      }
    });

    return true;
  }
}

registerProcessor('pulse-oscillator', PulseOscillator);
