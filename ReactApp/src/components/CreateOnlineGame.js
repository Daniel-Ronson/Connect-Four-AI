import React, { useRef, useState } from 'react';

import {Button} from 'react-bootstrap';

import firebase from '../Firebase/Firebase' 
import { useAuthState } from 'react-firebase-hooks/auth';

const auth = firebase.auth();
const firestore = firebase.firestore();

function CreateOnlineGame(){
    const { uid, displayName } = auth.currentUser;
    const gameRef = firestore.collection('Game');
    
    const  createGame = async (e) =>{
           await gameRef.add({
           gameCode:generateRandomNumber(),
           p1ID: uid,
           p1DisplayName: displayName,
           createdAt: firebase.firestore.FieldValue.serverTimestamp(),
           p2ID:'',
           p2DisplayName: '',
           p1NewGame: false,
           p2NewGame: false,
           GameOver: false,
           board: '',
         })
        CreategamePopup()
    }

    return (    
        <Button onClick={createGame}>Create Game</Button>
    )
}

//2194351234
function generateRandomNumber(){
    var array = new Uint32Array(1);
    return Math.floor(window.crypto.getRandomValues(array) / 100000);
}

function CreategamePopup() {
    const randomNumber = generateRandomNumber() 
    console.log( randomNumber)
}

export default CreateOnlineGame