import React, {useState, useContext} from 'react';

import {Navbar, Nav, Button} from 'react-bootstrap';
import logo from '../images/logo.PNG'
import '../App.css'
import firebase from '../Firebase/Firebase' 
import { useAuthState } from 'react-firebase-hooks/auth';
import AppContext from '../AppContext'

const auth = firebase.auth();

function SignIn(props) {
  const [user] = useState(props.user)
  const appContext = useContext(AppContext)

  const SignInAnonymous = () => {
     if(!auth.currentUser){firebase.app().auth().signInAnonymously()}
     appContext.setGameType('onlineGame')
     appContext.toggleIsOnline()
  }

  return (
    <>
      <Button variant="outline-success" className="sign-in" onClick={SignInAnonymous}>Play Online</Button>
    </>
  )
}

function SignOut() {
  const appContext = useContext(AppContext)
  appContext.toggleIsOnline()
  auth.signOut() 
}

function SignOutButton() {
  let appContext = useContext(AppContext)
  return appContext.state.isOnline === true &&(
    <Button variant="outline-success" className="sign-out" onClick={() => {
      appContext.toggleIsOnline()
      appContext.setGameType('')
    }}>
      Play Offline</Button>
  )
}

function MyNav() {
  const appContext = useContext(AppContext)
  const [user] = useAuthState(auth);
    return (
      <div>
        <Navbar className = "navbar-app">

        <Navbar.Brand href="#home">
          <img
            alt="connectfour"
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top mr-7"
          />{' '}
          Connect Four AI
        </Navbar.Brand>

        <Nav>
         <Nav.Link> {appContext.state.isOnline == false ? <SignIn user = {user}></SignIn>: <React.Fragment/>  }  </Nav.Link>
        </Nav>

        <Nav>
         <Nav.Link>   <SignOutButton/>   </Nav.Link>
        </Nav>  
    
      
      </Navbar>
      </div>
    )
}

export default MyNav