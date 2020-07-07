import React, { Component } from 'react';
import 'firebase/database';
import fire from './config/firebase';
import GameRoom from './components/gameRome';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
        current_Q: {
          question: '',
          options: ['', ''],
          answer: '',
        },
        game_on: false,
      },
      player_id: '',
      player_name: '',
    };
    this.game = fire.database().ref('game/');
  }
  componentDidMount() {
    this.sync_Q();
  }

  sync_Q = () => {
    // using the method "on" will watch players on db. Once changed, update local state
    this.game.on('value', (snap) => {
      const { current_Q } = snap.val();
      if (current_Q) {
        this.setState({
          game: {
            ...this.state.game,
            current_Q,
          },
        });
      }
    });
  };

  addPlayer = (e) => {
    e.preventDefault();
    const input_name = e.currentTarget[0].value;
    const input_room_code = e.currentTarget[1].value;
    fetch('https://api6.ipify.org?format=json', {
      method: 'GET',
      headers: {},
    })
      .then((json) => {
        return json.json();
      })
      .then((data) => {
        let ip = data.ip;
        const player_id = ip.replace(/\D/g, '');
        this.setState({
          player_id,
        });
      })
      .then(() => {
        const { player_id } = this.state;
        const player = { name: input_name, answer: '' };

        this.game.once('value', (snap) => {
          const { room_code, players } = snap.val();

          // if the room_code is the same as entered
          if (room_code === input_room_code) {
            let newPlayers = {};
            // if players exist
            if (players) {
              // loop through them
              if (
                players[player_id] &&
                players[player_id].name !== input_name
              ) {
                // throw message
                alert(
                  'Please, enter the same name you entered at the beginning',
                );
              } else if (
                players[player_id] &&
                players[player_id].name === input_name
              ) {
                this.setState({
                  player_name: input_name,
                });
              } else if (
                !players[player_id] &&
                players[player_id].name === input_name
              ) {
                newPlayers = { ...players };
                // make new players list
                newPlayers[player_id] = {
                  name: `${input_name} Jr.`,
                  answer: '',
                };
                this.game.update({
                  players: newPlayers,
                });
                this.setState({
                  player_name: `${input_name} Jr.`,
                });
              } else {
                newPlayers = { ...players };
                // make new players list
                newPlayers[player_id] = player;
                this.game.update({
                  players: newPlayers,
                });
                this.setState({
                  player_name: input_name,
                });
              }

              return true;
            } else {
              // else if there is no player, create a list and add current player
              newPlayers[player_id] = player;
              this.game.update({
                players: newPlayers,
              });
              this.setState({
                player_name: input_name,
              });
            }
          }
        });
      });
  };
  render() {
    const { player_name } = this.state;
    return (
      <div>
        {player_name ? (
          <GameRoom player={player_name} />
        ) : (
          <form onSubmit={this.addPlayer}>
            <input type='text' name='name' placeholder='Smiytek azzin' />
            <input type='text' name='room_code' placeholder='Code al9lawi' />
            <input
              style={{
                background: '#EAE1DF',
                color: '#474747',
                fontWeight: '700',
                border: '3px solid #474747',
              }}
              type='submit'
              value='SUBMIT'
            />
          </form>
        )}
      </div>
    );
  }
}
