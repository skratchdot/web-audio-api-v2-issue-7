import React, { useEffect, useState, useLayoutEffect } from 'react';
import * as styles from './analyser-chart.module.css';

const AnalyserChart = ({ analyser, chartType }) => {
  const [viewBox, setViewBox] = useState();
  const [d, setD] = useState('');
  const drawRef = React.useRef();

  const draw = () => {
    if (analyser) {
      let data;
      if (chartType === 'waveform') {
        data = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(data);
      } else if (chartType === 'fft') {
        data = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(data);
      }
      if (data) {
        const d = data.reduce(
          (prev, curr, index) => `${prev} M${index},0 L${index},${curr}`,
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
        setViewBox(`0 -1 ${analyser.fftSize} 2`);
      } else if (chartType === 'fft') {
        setViewBox(`0 -120 ${analyser.frequencyBinCount} 120`);
      }
    }
  }, [analyser, chartType]);

  return (
    <svg preserveAspectRatio="none" className={styles.svg} viewBox={viewBox}>
      <path stroke="black" d={d} />
    </svg>
  );
};

export default AnalyserChart;
