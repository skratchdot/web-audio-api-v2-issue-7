/* globals currentFrame, currentTime, sampleRate, registerProcessor */
/**
 * polyblep code taken from "mystran" on the forum:
 * https://www.kvraudio.com/forum/viewtopic.php?f=33&t=398553
 */

// a few default values
const DEFAULT_FREQUENCY = 440;
const DEFAULT_DETUNE = 0;
const DEFAULT_PULSE_WIDTH = 0.5;
const NO_PWM_FIX = false;

// The first sample BLEP
const poly3blep0 = (t) => {
  // these are just sanity checks
  // correct code doesn't need them
  if (t < 0) return 0;
  if (t > 1) return 1;

  const t2 = t * t;
  return t * t2 - 0.5 * t2 * t2;
};

// And second sample as wrapper, optimize if you want.
const poly3blep1 = (t) => -poly3blep0(1 - t);

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
    this.reset();
  }
  reset() {
    // set current phase to 0
    this.phase = 0;
    // blep delay "buffer" to zero
    this.blepDelay = 0;
    // previous pulseWidth to any valid value
    this.widthDelay = 0.5;
    // only 2 stages here, set to first
    this.pulseStage = 0;
  }
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const getFrequency = paramGetter(parameters.frequency);
    const getDetune = paramGetter(parameters.detune);
    const getPulseWidth = paramGetter(parameters.pulseWidth);
    const mix = 1; // 0=saw, 1=pulse

    output.forEach((channel) => {
      const nsamples = channel.length;

      for (let i = 0; i < nsamples; ++i) {
        // calculate frequency
        const frequency = getFrequency(i);
        const detune = getDetune(i);
        const calculatedFreq = frequency * Math.pow(2, detune / 1200);
        // normalized frequency
        const freq = calculatedFreq / sampleRate;

        // the BLEP latency is 1 sample, so first
        // take the delayed part from previous sample
        let out = this.blepDelay;

        // then reset the delay so we can build into it
        this.blepDelay = 0;

        // then proceed like a trivial oscillator
        this.phase += freq;

        // load and sanity-check the new PWM
        // ugly things would happen outside range
        let pulseWidth = getPulseWidth(i);
        if (pulseWidth > 1) pulseWidth = 1;
        if (pulseWidth < 0) pulseWidth = 0;

        // Then replace the reset logic: loop until we
        // can't find the next discontinuity, so during
        // one sample we can process any number of them!
        while (true) {
          let t;
          // Now in order of the stages of the wave-form
          // check for discontinuity during this sample.

          // First is the "pulse-width" transition.
          if (this.pulseStage === 0) {
            // if we didn't hit the pulse-width yet
            // break out of the while(true) loop
            if (this.phase < pulseWidth) break;

            if (NO_PWM_FIX) {
              // otherwise solve transition: when during
              // this sample did we hit the pw-border..
              // t = (1-x) from: phase + (x-1)*freq = pw
              t = (this.phase - pulseWidth) / freq;
            } else {
              // the above version is fine when pw is constant
              // and it's what we use for the reset part, but
              // for pw modulation, t could end up outside [0,1]
              // and that will sound pretty ugly, so use lerp:
              //   phase + (x-1)*freq = (1-x)*pwOld + x*pw
              // and again t = (1 - x), and hopefully..
              t =
                (this.phase - pulseWidth) /
                (this.widthDelay - pulseWidth + freq);
            }
            // so then scale by pulse mix
            // and add the first sample to output
            out += mix * poly3blep0(t);

            // and second sample to delay
            this.blepDelay += mix * poly3blep1(t);

            // and then we proceed to next stage
            this.pulseStage = 1;
          }

          // then whether or not we did transition, if stage
          // is at this point 1, we process the final reset
          if (this.pulseStage === 1) {
            // not ready to reset yet?
            if (this.phase < 1) break;

            // otherwise same as the pw, except threshold 1
            t = (this.phase - 1) / freq;

            // and negative transition.. normally you would
            // calculate step-sizes for all mixed waves, but
            // here both saw and pulse go from 1 to 0.. so
            // it's always the same transition size!
            out -= poly3blep0(t);
            this.blepDelay -= poly3blep1(t);

            // and then we do a reset (just one!)
            this.pulseStage = 0;
            this.phase -= 1;
          }

          // and if we are here, then there are possibly
          // more transitions to process, so keep going
        }

        // When the loop breaks (and it'll always break)
        // we have collected all the various BLEPs into our
        // output and delay buffer, so add the trivial wave
        // into the buffer, so it's properly delayed
        //
        // note: using pulseStage instead of pw-comparison
        // avoids inconsistencies from numerical inaccuracy
        this.blepDelay +=
          (1 - mix) * this.phase + mix * (this.pulseStage ? 1 : 0);

        // and output is just what we collected, but
        // let's make it range -1 to 1 instead
        channel[i] += 2 * out - 1;

        // and store pulse-width delay for the lerp
        this.widthDelay = pulseWidth;
      }
    });

    return true;
  }
}

registerProcessor('pulse-oscillator', PulseOscillator);
