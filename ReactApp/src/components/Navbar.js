import React from 'react';

import {Navbar, Nav, Button} from 'react-bootstrap';
import logo from '../images/logo.PNG'
import '../App.css'
import firebase from '../Firebase/Firebase' 
import { useAuthState } from 'react-firebase-hooks/auth';
const auth = firebase.auth();

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  const SignInAnonymous = () => {
    firebase.app().auth().signInAnonymously();
  }

  return (
    <>
      <Button variant="outline-success" className="sign-in" onClick={SignInAnonymous}>Play Online</Button>
    </>
  )
}

function SignOut() {
  return auth.currentUser &&(
    <Button variant="outline-success" className="sign-out" onClick={() => auth.signOut()}>Play Offline</Button>
  )
}

function GoOnlineButton(){
  return(
    <button>Go Online</button>
  )
}

function MyNav() {
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
         <Nav.Link> {user ?<React.Fragment/> :  <SignIn/> }  </Nav.Link>
        </Nav>

        <Nav>
         <Nav.Link>   <SignOut/>   </Nav.Link>
        </Nav>  
    
      
      </Navbar>
      </div>
    )
}

export default MyNav