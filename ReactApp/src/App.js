import './App.css'
import React, {useEffect} from 'react';
import AppContext from './AppContext'
import ConnectFour from './components/ConnectFour/ConnectFour'
import OnlineGame from './components/ConnectFour/Online'
import PlayerChoice from './components/PlayerChoice/PlayerChoice'
import Navbar from './components/Navbar'
import {Container, Col, Row} from 'react-bootstrap';
import firebase from './Firebase/Firebase' 
import { useAuthState } from 'react-firebase-hooks/auth';
import CreateOnlineGame from './components/OnlineGame/CreateOnlineGame';
// import {initGA, pageView} from './Firebase/Analytics'
// const analytics =   firebase.analytics();

const auth = firebase.auth();
const firestore = firebase.firestore();
const pageViewRef = firestore.collection('PageViews')

function App(){

  useEffect( () => {
    // Rudimentary Page View Counter
    const data = pageViewRef.doc('KvBM3DxmleEUHfabRLZU').get().then( (doc) =>{
      const pageHits = doc.data().PageHits + 1
      console.log('writing: ' + pageHits)
      pageViewRef.doc('KvBM3DxmleEUHfabRLZU').update({PageHits:pageHits})
    })
  },[])

  const [user] = useAuthState(auth);
    return (
      <AppContext.Consumer>
        {(context) => (
      <React.Fragment>
        <Navbar></Navbar>
        {user && context.state.isOnline == true ? <CreateOnlineGame/> : <PlayerChoice/>}
      <div className="App mt-3 mb-5">
        <Container fluid className="pb-2">
          <Row>
        <Col>
          {(user && context.state.isOnline == true)
            ? <OnlineGame gameDocumentId = {context.state.gameDocumentId}>   </OnlineGame> 
            : <ConnectFour gameType={context.state.gameType} className="mt-5  marginTop">  </ConnectFour> }
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
