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
      // VIP: false,
      loged_in: false,
      waiting_room: true,
      game: {
        play_room: false,
        start: false,
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

  componentDidUpdate(nextProp, nextState) {
    const { current_Q } = nextState.game;
    const user = fire.database().ref(`game/players/${nextState.player_id}`);
    console.log(user)
    // start game for players if the current_Q.answer is not empty
    if (current_Q.answer) {
      // this.game.once('value', (snap) => {
        // const { players } = snap.val();
        // const { player_id } = this.state;

        user.update({
          waiting_room: false
        })
        // let newPlayers = players; // make copy of players

        // newPlayers[player_id] = {
        //   //change the waiting room of this player
        //   ...players[player_id],
        //   waiting_room: false,
        // };

        // this.game.update({
        //   players: newPlayers, // replace with the new players
        // });
      // });
    }else {
      // this.game.once('value', (snap) => {
      //   const { players } = snap.val();
      //   const { player_id } = this.state;

      //   let newPlayers = players; // make copy of players

      //   newPlayers[player_id] = {
      //     //change the waiting room of this player
      //     ...players[player_id],
      //     waiting_room: true,
      //   };

      //   this.game.update({
      //     players: newPlayers, // replace with the new players
      //   });
      // });
      user.update({
        waiting_room: true
      })
    }
  }
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
      const { room_code, players } = snap.val();
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

    const checked_input = document.querySelector('input[name=answer]:checked');

    //if the answer was submitted
    if (checked_input) {
      console.log(checked_input.value);
    } else {
      alert('nothing was selected');
    }
    // const form = res.target.length;
    //   form.map(input=>{
    //     const current_input = form[input].checked;
    //     if (current_input){
    //       console.log(current_input);
    //     }
    //   })
  };
  render() {
    const {
      loged_in,
      input_name,
      input_room_code,
      VIP,
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
            // player={input_name}
            // VIP={VIP}
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
