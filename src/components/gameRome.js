import React from 'react';
let lantern = require('./imgs/lantern.svg');

export default function GameRoom({ player }) {
  return (
    <div className="game_room">
      <h1>{player}</h1>
      <img className='lantern' alt='tile' src={lantern} />

      <p>تصحر معا لبراهش تصبح فاطر</p>
      <input type='button' className='allIn' value="EVERYONE'S IN" />
    </div>
  );
}
