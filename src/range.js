import React from 'react';

const Range = ({ presets, setter, ...props }) => {
  return (
    <div>
      {props.name}:&nbsp;
      <small>{props.value}</small>
      <br />
      <input
        {...props}
        type="range"
        onChange={(e) => setter(parseFloat(e.target.value))}
      />
      <br />
      {(presets || []).map((preset) => (
        <button
          key={preset}
          disabled={props.value === preset}
          onClick={() => setter(preset)}
          style={{ marginBottom: 10 }}
        >
          {preset}
        </button>
      ))}
    </div>
  );
};

export default Range;
