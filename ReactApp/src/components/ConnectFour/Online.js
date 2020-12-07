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
  const [gameData,setGameData] = useState(false)
  const [gameDocId,setGameDocId] = useState(0)
  const [playerId,setPlayerId] = useState(0)

  const [isTurn,setIsTurn] = useState(false)
  const [isPlayer1,setIsPlayer1] = useState(false)
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
          // toDO: set doc.data().p2ID = uid
          //if (uid === doc.data().p2ID){
          else {
            setIsPlayer1(false)
            console.log('is not player 1')
          }
          //else {setReturnErrorMessage(true); return;}

          
          // if p1 id equals uid, then set player to player 1 
          // else if p2 id equals uid, then set.....
          // else Display Error Message: invalid game invite
        
          console.log('GOT data: ')
          console.log(doc.data())

         setGameData(doc.data().p1DisplayName)
         setIsTurn(doc.data().p1Turn)
         console.log('the board: ' + doc.data().board)
        // if(doc.data().board != "")
         let newBoard = JSON.parse(doc.data().board)
         console.log('the board: ' + newBoard)
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

  const makeMoveOnline = async (newBoard) => {
    let flag = isTurn ? false : true
    firestore.collection('Game').doc(gameDocId).update({board: newBoard,p1Turn: flag}).then( () => {
      console.log('update Successful')
      return true
    }).catch(() => {console.log('Update Failure'); return false})
  }
  const setStateToBase = async () => {
    if(isPlayer1)
    setIsTurn(true)
    //setBoard('')
  }

  // If i set the board equal to null, in useEffect, the JSON.parse does not work, So it must be set to an object
  const boardInitialState = "[[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]"

  const setNewGame = async ()  => {
    await firestore.collection('Game').doc(gameDocId).update({board: boardInitialState,p1Turn: true}).then( (doc) => {
      console.log('game cleared')

    }).catch(() => {console.log('New Game Failed');})
    setStateToBase()
  }

   return(
    <React.Fragment>
      <ConnectFour
       board={board}  
       updateGameOnline={updateGame} // updates game board
       togglePlayerOnline = {togglePlayer} 
       makeMoveOnline = {makeMoveOnline} //combines updateGameOnline and togglePlayerOnline
       initGameOnline = {setNewGame}
       gameType={appContext.state.gameType} // single, mulitplayer, or online
       isTurn={isTurn} // true if it is player 1 turn
       isPlayer1 = {isPlayer1}  // true if you are player 1 
       canJoinGame = {canJoinGame} //initially set to false
       returnErrorMessage = {returnErrorMessage}  // false if error occured while joining game
      >
      </ConnectFour>
    {/* <p>Player 1: {isPlayer1 ? isPlayer1 : null}</p>
    <p>game board: {board ? board : null}</p>
    <p>Player 1 Turn: {isTurn.toString()}</p> */}
    </React.Fragment> 
    )
}

export default OnlineGame