
import React, { useRef, useState } from 'react';
import  './Messaging.css';

import firebase from '../../Firebase/Firebase' 

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';



const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function Messaging() {

  const [user] = useAuthState(auth);

  return (
    <div className="Messages">
               <SignOut/>
        <section>
            {user ? <ChatRoom /> : <SignIn />}
        </section>
    </div>

  );
}


function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function AddToDB(){
  const gameRef = firestore.collection('Game');
  const [formValue, setFormValue] = useState('');

  const createGame = async (e) => {
    const { uid, photoURL } = auth.currentUser;

    await gameRef.add({
      text: 'game3',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
  }

  return(
    <button onClick={createGame}>Start Game</button>
  )
}


function ChatRoom() {
  const { uid } = auth.currentUser;
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  //const query = messagesRef.where('uid','==',uid).limit(5)
  const query = messagesRef.orderBy('createdAt').limitToLast(10);
//  const query = messagesRef.orderByChild('uid').equalTo(uid).limitToLast(5);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <div className="messageContainer">

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>
      <form className = "messageForm" onSubmit={sendMessage}>

          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

          <button type="submit" disabled={!formValue}>🕊️</button>

      </form>
    </div>

  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default Messaging;