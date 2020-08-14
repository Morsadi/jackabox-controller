import React, { Component } from 'react';
import 'firebase/database';
import fire from './config/firebase';
import WaitRoom from './components/waitRoom';
import './stylesheet.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input_name: '',
      input_room_code: '',
      player_id: '',
      error: '',
      loged_in: false,
      waiting_room: true,
      game: {
        play_room: false,
        current_Q: {
          question: '',
          options: ['', ''],
          answer: '',
        },
      },
    };
    this.game = fire.database().ref('game/');
    // this.player = fire.database().ref(`game/players/${this.state.player_id}`);
  }
  componentDidMount() {
    this.get_ip();
    this.sync_game();
  }

  // componentDidUpdate(prevProp, prevState, snap) {
  //   const { current_Q } = prevState.game;
  //   // console.log('snap', snap)
  //   // console.log('state answer', this.state.game.current_Q.answer)
  //   console.log('prev state', prevState.game.current_Q.answer)
  //   const user = fire.database().ref(`game/players/${this.state.player_id}`);
  //   // start game for players if the answer changed to true

  //   // if (!current_Q.answer & this.state.game.current_Q.answer) {
  //   //   user.update({
  //   //     waiting_room: false,
  //   //   });
  //   // }
  //   if (prevState.game.current_Q.answer){
  //     console.log('changed to true');
  //   }else {
  //     return false
  //   }
  // }
  // handling input event
  eventHandler = (e) => {
    let key = e.target.name;
    let value = e.target.value;

    this.setState({
      [key]: value,
    });
  };

  sync_game = () => {
    this.game.on('value', (snap) => {
      // listen to game changes
      const game = snap.val();
      const { players } = snap.val();
      const { player_id } = this.state;
      this.setState({
        game, // Update game
      });

      if (players && players[player_id]) {
        // if the player id already exists
        this.setState({
          loged_in: true, // take player to the game room
        });
      } else {
        console.log('player doesnt exist');
      }
     
    });
  };
  get_ip = () => {
    this.IP_finder()
      .then((player_id) => {
        this.setState({
          player_id,
        });
      })
      .catch((err) => console.log(err));
  };

  addPlayer = () => {
    const { input_room_code, input_name, player_id } = this.state;

    const player = { name: input_name, answer: '', waiting_room: true };

    this.game.once('value', (snap) => {
      const { room_code, players } = snap.val();

      // if the room_code is the same as entered
      if (room_code === input_room_code) {
        if (!players) {
          // if there is no player
          this.game.update({
            // add the current player
            players: { [player_id]: player },
          });
          this.setState({
            // send to waiting room
            loged_in: true,
          });
        } else {
          // if other players exist
          let newPlayers = players; // make copy of them
          newPlayers[player_id] = player; // add the new player

          this.game.update({
            // update the database with the new players
            players: newPlayers,
          });
          this.setState({
            // send to waiting room
            loged_in: true,
          });
        }
      } else {
        this.setState({
          error: 'Wrong code hbiba',
        });
      }
    });
  };

  // fetch IP
  IP_finder = async () => {
    // fetch for device IP
    return fetch('https://api6.ipify.org?format=json', {
      method: 'GET',
      headers: {},
    })
      .then((json) => {
        return json.json();
      })
      .then((data) => {
        let ip = data.ip;
        const player_id = ip.replace(/\D/g, ''); // keep just the digits
        return player_id;
      });
  };
  submit_answer = (res) => {
    res.preventDefault();
    const user = fire.database().ref(`game/players/${this.state.player_id}`);
    const checked_input = document.querySelector('input[name=answer]:checked');

    //if the answer was submitted
    if (checked_input) {
      user.update({
        answer: checked_input.value,
        waiting_room: true
      })
      
    } else {
      alert('nothing was selected');
    }
  };
  render() {
    const {
      loged_in,
      input_name,
      input_room_code,
      error,
      game,
      player_id,
      waiting_room,
    } = this.state;
    return (
      <div>
        {loged_in ? (
          <WaitRoom
            player_id={player_id}
            submit_answer={this.submit_answer}
            game={game}
            waiting_room={waiting_room}
          />
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
            {error ? <p>{error}</p> : null}
          </div>
        )}
      </div>
    );
  }
}
