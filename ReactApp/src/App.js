import './App.css'
import React, { Component } from 'react';

//import ConnectFour from './components/ConnectFour/ConnectFour'
import ConnectFour from './components/ConnectFour/Online'
import Messaging from './components/Messages/Messaging'

import Navbar from './components/Navbar'
import {Container, Col, Row} from 'react-bootstrap';

const AppContext = React.createContext()

class AppProvider extends Component {
  state = {
    gameType: 'gametype',

  }
  render() {
    return (
      <AppContext.Provider value={{
        state: this.state,
        setGameType: (game) => this.setState({
          gameType: game
        })
      }}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

function App() {
  return (
    <AppProvider>
    <div className="App">
      <Navbar className="navbar-app"></Navbar>
      <Container fluid className="mt-5 pb-3 pt-5">
        <Row>      <PlayerChoice/>    </Row>
        <Row>
          <Col><ConnectFour className="mt-5 marginTop"></ConnectFour></Col>
          <Col><Messaging/></Col>
        </Row>
      </Container>
    </div>
    </AppProvider>
  );
}




export default App;
