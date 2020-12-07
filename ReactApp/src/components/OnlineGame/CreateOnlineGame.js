import React, { useState, useContext } from 'react';
import firebase from '../../Firebase/Firebase' 
import JoinGame from './JoinGame';
import AppContext from '../../AppContext'
const auth = firebase.auth();
const firestore = firebase.firestore();

function CreateOnlineGame(){
    const { uid, displayName } = auth.currentUser;
    const gameRef = firestore.collection('Game');
    const [gameCode, setGameCode] = useState()
    const [gameDocumentId, setgameDocumentId] = useState()

    const appContext = useContext(AppContext)

    const  createGame = async (e) =>{
          let gameCode = generateRandomNumber()
          let display_name = displayName == null ? "anonymous" : displayName
           await gameRef.add({
           gameCode: gameCode,
           p1ID: uid,
           p1DisplayName: display_name,
           createdAt: firebase.firestore.FieldValue.serverTimestamp(),
           p2ID:'',
           p2DisplayName: '',
           p1NewGame: false,
           p2NewGame: false,
           GameOver: false,
           board: '',
         }).then( (docRef) => {
            console.log('DOCUMENT REF: ',  docRef.id)
            console.log(typeof  docRef.id)
            appContext.setGameType('onlineGame')
            setGameCode(gameCode)
            setgameDocumentId(docRef.id)
            appContext.setGameDocumentId(docRef.id)

         }).catch ( (error) => {
             console.log('error adding new game to db')
         })
        console.log('gamecode: ' + gameCode)
    }

    return (    
        <AppContext.Consumer>
        {(context) => (
        <div className="controlPanel">
            <button className="mr-2" onClick={createGame}>Create Game</button>
            <JoinGame className="aside-2" gameCode={gameCode} gameDocumentId = {gameDocumentId}></JoinGame>
        </div>
        )}
        </AppContext.Consumer>
    )
}

//2194351234
function generateRandomNumber(){
    var array = new Uint32Array(1);
    return Math.floor(window.crypto.getRandomValues(array) / 100000);
}


export default CreateOnlineGame