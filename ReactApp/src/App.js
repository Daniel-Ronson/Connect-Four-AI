import './App.css'
import React, { Component } from 'react';
import AppContext from './AppContext'

import ConnectFour from './components/ConnectFour/ConnectFour'
//import ConnectFour from './components/ConnectFour/Online'
import Messaging from './components/Messages/Messaging'
import PlayerChoice from './components/PlayerChoice/PlayerChoice'
import Navbar from './components/Navbar'
import {Container, Col, Row} from 'react-bootstrap';

class AppProvider extends Component {
  state = {
    gameType: 'singlePlayer',
    gameMode: 'easy'
  }

  render() {
    return (
      <AppContext.Provider value={{
        state: this.state,
        setGameType: (game) => this.setState({
          gameType: game
        }),
        setGameDifficulty: (mode) => this.setState({
          gameMode: mode
        })
      }}>
        {this.props.children}
        {console.log('game type: ' + this.state.gameType)}
        {console.log('difficulty: ' + this.state.gameMode)}
      </AppContext.Provider>
    )
  }
}


function App(){

  return (
    <AppProvider>
    <div className="App">
      <Navbar className="navbar-app"></Navbar>
      <Container fluid className="">
        <Row>      <PlayerChoice/>    </Row>
        <Row>
          <Col><ConnectFour className="mt-5 marginTop"></ConnectFour></Col>
        </Row>
      </Container>
    </div>
    </AppProvider>
  );
}





export default App;
