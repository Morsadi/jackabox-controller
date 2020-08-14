import React from 'react';

export default function GameRoom({ submit_answer, game }) {
  return (
    <div>
      <div>
        <h2>{game.current_Q.question}</h2>
        <form onSubmit={submit_answer}>
          {game.current_Q.options.map((option, i) => (
            <div key={`answer-${i}`}>
              <input
                id={`option${i}`}
                type='radio'
                name='answer'
                value={option}
              />
              <label htmlFor={`option${i}`}>{option}</label>
            </div>
          ))}
          <input type='submit' value='SUBMIT' />
        </form>
      </div>
    </div>
  );
}
