import './App.css'
import React, { Component } from 'react';
import AppContext from './AppContext'

import ConnectFour from './components/ConnectFour/ConnectFour'
//import ConnectFour from './components/ConnectFour/Online'
import PlayerChoice from './components/PlayerChoice/PlayerChoice'
import Navbar from './components/Navbar'
import {Container, Col, Row} from 'react-bootstrap';
class AppProvider extends Component {
  state = {
    gameType: 'singlePlayer',
    gameMode: 'easy',
    experimentalFlag: false,
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
        }),
        setExperimentalFlag: () => this.setState({
          experimentalFlag: this.state.experimentalFlag == false ? true : false
        })
      }}>
        {this.props.children}
        {console.log('game type: ' + this.state.gameType)}
        {console.log('difficulty: ' + this.state.gameMode)}
        {console.log('experimental: ' + this.state.experimentalFlag + ' ' + typeof this.state.experimentalFlag)}
      </AppContext.Provider>
    )
  }
}


function App(){

  return (
    <AppProvider>
      <Navbar></Navbar>
      <PlayerChoice ></PlayerChoice>
    <div className="App mt-3">
      <Container fluid className="">
        <Row>
          <Col><ConnectFour className="mt-5 marginTop"></ConnectFour></Col>
        </Row>
      </Container>
    </div>
    </AppProvider>
  );
}





export default App;
