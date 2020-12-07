import './App.css'
import React, { Component, useContext } from 'react';
import AppContext from './AppContext'

import ConnectFour from './components/ConnectFour/ConnectFour'
import OnlineGame from './components/ConnectFour/Online'
//import ConnectFour from './components/ConnectFour/Online'
import PlayerChoice from './components/PlayerChoice/PlayerChoice'
import Navbar from './components/Navbar'
import {Container, Col, Row} from 'react-bootstrap';
import firebase from './Firebase/Firebase' 
import { useAuthState } from 'react-firebase-hooks/auth';
import CreateOnlineGame from './components/OnlineGame/CreateOnlineGame';

const auth = firebase.auth();



function App(){
  const [user] = useAuthState(auth);
    return (
      <AppContext.Consumer>
        {(context) => (
      <React.Fragment>
        <Navbar></Navbar>
        {user && context.state.isOnline == true ? <CreateOnlineGame/> : <PlayerChoice/>}
      <div className="App mt-3">
        <Container fluid className="">
          <Row>
        <Col>
          {(user && context.state.isOnline == true)
            ? <OnlineGame gameDocumentId = {context.state.gameDocumentId}>   </OnlineGame> 
            : <ConnectFour gameType={context.state.gameType} className="mt-5 marginTop">  </ConnectFour> }
        </Col>
          </Row>
        </Container>
      </div>
      </React.Fragment>
        )}
      </AppContext.Consumer>
    );
}





export default App;
