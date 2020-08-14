import React from 'react';
import GameRoom from './gameRoom';

let lantern = require('./imgs/lantern.svg');

export default function WaitRoom({ player_id, submit_answer, game }) {
  const { name, waiting_room } = game.players[player_id];
  return (
    <div className='game_room'>
      {!waiting_room ? (
        <GameRoom submit_answer={submit_answer} game={game} player={name} />
      ) : (
        <div>
          <h1>{name}</h1>
          <img className='lantern' alt='tile' src={lantern} />

          <p>تصحر معا لبراهش تصبح فاطر</p>
        </div>
      )}
    </div>
  );
}
