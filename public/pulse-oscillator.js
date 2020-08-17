/* globals currentFrame, currentTime, sampleRate, registerProcessor */
/**
 * Trying to port the polyblep code from:
 * http://metafunction.co.uk/all-about-digital-oscillators-part-2-blits-bleps/
 */

// a few default values
const DEFAULT_FREQUENCY = 440;
const DEFAULT_DETUNE = 0;
const DEFAULT_PULSE_WIDTH = 0.5;
const TWOPI = Math.PI * 2;

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
    this.twoPiOverSr = TWOPI / sampleRate;
    this.freq = 0;
    this.phase = 0;
    this.incr = 0;

    /* http://metafunction.co.uk/all-about-digital-oscillators-part-2-blits-bleps/ */
    this.poly_blep = (t) => {
      const dt = this.incr / TWOPI;
      // t-t^2/2 +1/2
      // 0 < t <= 1
      // discontinuities between 0 & 1
      if (t < dt) {
        t /= dt;
        return t + t - t * t - 1.0;
      }
      // t^2/2 +t +1/2
      // -1 <= t <= 0
      // discontinuities between -1 & 0
      else if (t > 1.0 - dt) {
        t = (t - 1.0) / dt;
        return t * t + t + t + 1.0;
      }
      // no discontinuities
      // 0 otherwise
      else return 0.0;
    };
    this.fmod = (a, b) => a % b;
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

        // channel[i] = Math.sin(this.phase); // sine
        // channel[i] = this.phase / Math.PI; // sawtooth
        // channel[i] = this.phase <= TWOPI * pulseWidth - Math.PI ? 1 : -1; // square

        let t = this.phase / TWOPI;
        let value = this.phase <= TWOPI * pulseWidth - Math.PI ? 1 : -1; // square
        //value += this.poly_blep(t); // Layer output of Poly BLEP on top (flip)
        //value -= this.poly_blep(this.fmod(t + 0.5, 1.0)); // Layer output of Poly BLEP on top (flop)
        channel[i] = value;

        // set new phase
        if (this.freq !== freq) {
          this.freq = freq;
          this.incr = this.twoPiOverSr * freq;
        }
        this.phase += this.incr;
        if (this.phase >= Math.PI) {
          this.phase -= TWOPI;
        } else if (this.phase < -Math.PI) {
          this.phase += TWOPI;
        }
      }
    });

    return true;
  }
}

registerProcessor('pulse-oscillator', PulseOscillator);
