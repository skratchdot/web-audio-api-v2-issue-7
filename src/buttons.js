import React from 'react';

const Buttons = ({ playType, choices, setPlayType }) => {
  return (
    <div>
      audio output:
      <br />
      {choices.map((choice) => (
        <button
          key={choice}
          disabled={choice === playType}
          onClick={() => setPlayType(choice)}
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default Buttons;
