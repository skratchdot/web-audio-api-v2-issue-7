import React, { useEffect, useState, useLayoutEffect } from 'react';
import * as styles from './analyser-chart.module.css';

const WAVEFORM_MIN = -1;
const WAVEFORM_MAX = 1;
const FFT_MIN = -120;
const FFT_MAX = 0;

const AnalyserChart = ({ analyser, chartType }) => {
  const [viewBox, setViewBox] = useState();
  const [d, setD] = useState('');
  const drawRef = React.useRef();

  const draw = () => {
    if (analyser) {
      let data;
      let min;
      let max;
      if (chartType === 'waveform') {
        data = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(data);
        min = WAVEFORM_MIN;
        max = WAVEFORM_MAX;
      } else if (chartType === 'fft') {
        data = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(data);
        min = FFT_MIN;
        max = FFT_MAX;
      }
      if (data) {
        const d = data.reduce(
          (prev, curr, index) => {
            let val = curr;
            if (val < min) {
              val = min;
            } else if (val > max) {
              val = max;
            } else if (!Number.isFinite(val)) {
              val = 0;
            }
            return `${prev} M${index},0 L${index},${val}`;
          },
          ''
        );
        setD(d);
      }
    }
    drawRef.current = requestAnimationFrame(draw);
  };

  useLayoutEffect(() => {
    drawRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(drawRef.current);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (analyser) {
      if (chartType === 'waveform') {
        setViewBox(`0 ${WAVEFORM_MIN} ${analyser.fftSize} ${WAVEFORM_MAX - WAVEFORM_MIN}`);
      } else if (chartType === 'fft') {
        setViewBox(`0 ${FFT_MIN} ${analyser.frequencyBinCount} ${FFT_MAX - FFT_MIN}`);
      }
    }
  }, [analyser, chartType]);

  return (
    <svg preserveAspectRatio="none" className={styles.svg} viewBox={viewBox}>
      <path d={d} className={styles.path} />
    </svg>
  );
};

export default AnalyserChart;
