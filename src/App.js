import React, { Component } from 'react';
import 'firebase/database';
import fire from './config/firebase';
import GameRoom from './components/gameRome';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input_name: '',
      input_room_code: '',
      player_id: '',
      VIP: false,
      game: {
        current_Q: {
          question: '',
          options: ['', ''],
          answer: '',
        },
        game_on: false,
      },
    };
    this.game = fire.database().ref('game/');
  }
  componentDidMount() {
    this.sync_Q();
  }
// handling input event
  eventHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;

    this.setState({
      [key]: value,
    });
  };

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

  addPlayer = () => {
let target = document.querySelector('body');
target.style.background = 'red'

this.setState({
loged_in: true
})
    // const { input_room_code, input_name } = this.state;
    // // fetch for device IP
    // fetch('https://api6.ipify.org?format=json', {
    //   method: 'GET',
    //   headers: {},
    // })
    //   .then((json) => {
    //     return json.json();
    //   })
    //   .then((data) => {
    //     // then store id in the state
    //     let ip = data.ip;
    //     // keep just the digits
    //     const player_id = ip.replace(/\D/g, '');
    //     // state
    //     this.setState({
    //       player_id,
    //     });
    //   })
    //   .then(() => {

    //     const { player_id } = this.state;
    //     const player = { name: input_name, answer: '' };

    //     this.game.once('value', (snap) => {
    //       const { room_code, players } = snap.val();

    //       // if the room_code is the same as entered
    //       if (room_code === input_room_code) {
    //         let newPlayers = {};
    //         // if players exist
    //         if (players) {
    //           // if the current id exists while the name is wrong, throw the error
    //           if (
    //             players[player_id] &&
    //             players[player_id].name !== input_name
    //           ) {
    //             // throw message
    //             alert(
    //               'Please, enter the same name you entered at the beginning',
    //             );
    //             // if the current id exists while the name is correct, log in
    //             // this helps if someone disconnected, or refreshed the page
    //           } else if (
    //             players[player_id] &&
    //             players[player_id].name === input_name
    //           ) {
    //             // state
    //             this.setState({
    //               loged_in: true,
    //             });
    //             // if the id doesn't exist but the name does, push the player to the list but add Jr. as a suffix
    //           } else if (
    //             !players[player_id] &&
    //             players[player_id].name === input_name
    //           ) {
    //             newPlayers = { ...players };
    //             // make new players list
    //             newPlayers[player_id] = {
    //               name: `${input_name} Jr.`,
    //               answer: '',
    //             };
    //             // firebase
    //             this.game.update({
    //               players: newPlayers,
    //             });
    //             // state
    //             this.setState({
    //               input_name: `${input_name} Jr.`,
    //               loged_in:true
    //             });
    //             // add player if they don't exist
    //           } else {
    //             newPlayers = { ...players };
    //             // make new players list
    //             newPlayers[player_id] = player;
    //             // firebase
    //             this.game.update({
    //               players: newPlayers,
    //             });
    //             // state
    //             this.setState({
    //               loged_in: true,
    //             });
    //           }
              
    //           return true;
    //         } else {
    //           // else make a new list and add the first player and make him VIP
    //           newPlayers[player_id] = player;
    //           // firebase
    //           this.game.update({
    //             players: newPlayers,
    //           });
    //           // state
    //           this.setState({
    //             loged_in: true,
    //             VIP: true
    //           });
    //         }
    //       }
    //     });
    //   });
  };
  render() {
    const { loged_in, input_name, input_room_code, VIP } = this.state;
    return (
      <div>
        {loged_in ? (
          <GameRoom player={input_name} VIP={VIP} />
        ) : (
          <div className='form' onSubmit={this.addPlayer}>
            <input
              type='text'
              name='input_name'
              onChange={this.eventHandler}
              placeholder='Smiytek azzin'
              value={input_name}
            />
            <input
              type='text'
              name='input_room_code'
              onChange={this.eventHandler}
              placeholder='Code al9lawi'
              value={input_room_code}
            />
            <input
              style={{
                background: '#EAE1DF',
                color: '#474747',
                fontWeight: '700',
                border: '3px solid #474747',
                cursor: 'pointer',
              }}
              type='submit'
              value='SUBMIT'
              onClick={this.addPlayer}
            />
          </div>
        )}
      </div>
    );
  }
}
