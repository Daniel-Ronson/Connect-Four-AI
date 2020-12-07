import React, {useContext, useEffect, useState} from 'react';
import context from 'react-bootstrap/esm/AccordionContext';
import AppContext from '../../AppContext'

import firebase from '../../Firebase/Firebase' 
import ConnectFour from '../ConnectFour/ConnectFour'
//10109
const auth = firebase.auth();
const firestore = firebase.firestore();

function OnlineGame(props){
  const appContext = useContext(AppContext)
  const { uid } = auth.currentUser;
  const [gameData,setGameData] = useState()
  const [gameDocId,setGameDocId] = useState(0)
  const [playerId,setPlayerId] = useState(0)

  const [isTurn,setIsTurn] = useState()
  const [isPlayer1,setIsPlayer1] = useState()
  const [returnErrorMessage, setReturnErrorMessage] = useState(false)
  const [canJoinGame,setCanJoinGame] = useState(false)

  const [board,setBoard] = useState()
  //const [boar,setGameCode] = useState()


  const gameRef = firestore.collection('Game')
  useEffect( () => {
    setGameDocId(props.gameDocumentId)
    console.log('searching for doc: ' , props.gameDocumentId)
    if(props.gameDocumentId !==  null){
    const unsubscribe = gameRef.doc(props.gameDocumentId)
    .onSnapshot(
       doc => {
        if(typeof doc.data() !== 'undefined'){
          if (uid === doc.data().p1ID){
            setIsPlayer1(true)
            console.log('is player 1')
          }
          else if (uid === doc.data().p2ID){
            setIsPlayer1(false)
            console.log('is not player 1')
          }
          else {setReturnErrorMessage(true); return;}
          // if p1 id equals uid, then set player to player 1 
          // else if p2 id equals uid, then set.....
          // else Display Error Message: invalid game invite
        
          console.log('GOT data: ')
          console.log(doc.data())

         setGameData(doc.data().p1DisplayName)
         setIsTurn(doc.data().p1Turn)
         let newBoard = JSON.parse(doc.data().board)
         setBoard(newBoard)
         setCanJoinGame(true) // Game Succesfully joined
      }
      else{
        console.log('invalid code')
        setReturnErrorMessage(true)
        //ToDo: Reset Data to 0 
      }
      },
      err => {
        console.log('error')
      }
    )
    return () => unsubscribe()
    } // end of if
     },[props.gameDocumentId])

 const updateGame = async (newBoard) => {
      firestore.collection('Game').doc(gameDocId).update({board: newBoard}).then( () => {
        console.log('update Successful')
        return true
      }).catch(() => {console.log('Update Failure'); return false})
  }
  const togglePlayer = async () => {
    let flag = isTurn ? false : true
    firestore.collection('Game').doc(gameDocId).update({p1Turn: flag}).then( () => {
      console.log('update Successful')
      return true
    }).catch(() => {console.log('Update Failure'); return false})
  }

  const setStateToBase = async () => {
    setIsTurn(true)
  }

  const setNewGame = async ()  => {
    firestore.collection('Game').doc(gameDocId).update({board: ''}).then( () => {
      console.log('game cleared')
      return true
    }).catch(() => {console.log('New Game Failed'); return false})
    setStateToBase()
  }

   return(
    <React.Fragment>
      <ConnectFour
       board={board}  
       updateGameOnline={updateGame} // updates game board
       togglePlayerOnline = {togglePlayer} 
       initGameOnline = {setNewGame}
       gameType={appContext.state.gameType} // single, mulitplayer, or online
       isTurn={isTurn} // true if it is player 1 turn
       isPlayer1 = {isPlayer1}  // true if you are player 1 
       canJoinGame = {canJoinGame} //initially set to false
       returnErrorMessage = {returnErrorMessage}  // false if error occured while joining game
      >
      </ConnectFour>
    <div>hi</div>
    <p>Player 1: {isPlayer1 ? isPlayer1 : null}</p>
    <p>game board: {board ? board : null}</p>
    <p>Player 1 Turn: {isTurn}</p>
    </React.Fragment> 
    )
}

export default OnlineGame