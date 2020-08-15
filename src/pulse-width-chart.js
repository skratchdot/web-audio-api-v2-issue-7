import React from 'react';
import * as styles from './analyser-chart.module.css';

const PulseWidthChart = ({ numCycles, pulseWidth }) => {
  let d = '';
  const pointsPerCycle = 100;
  const len = numCycles * pointsPerCycle;
  for (let cycle = 0; cycle < numCycles; cycle++) {
    for (let i = 0; i < pointsPerCycle; i++) {
      const val = i / pointsPerCycle < pulseWidth ? -1 : 1;
      const index = cycle * pointsPerCycle + i;
      d += `M${index},0 L${index},${val}`;
    }
  }
  return (
    <svg
      className={styles.svg}
      preserveAspectRatio="none"
      viewBox={`0 -1 ${len} 2`}
    >
      <path stroke="black" d={d} />
    </svg>
  );
};

export default PulseWidthChart;
