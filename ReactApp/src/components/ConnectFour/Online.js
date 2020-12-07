import React, {useContext, useEffect, useState} from 'react';
import AppContext from '../../AppContext'

import firebase from '../../Firebase/Firebase' 
import ConnectFour from '../ConnectFour/ConnectFour'
//10109
const auth = firebase.auth();
const firestore = firebase.firestore();

function OnlineGame(props){
  const appContext = useContext(AppContext)
  const  currUser  = auth.currentUser;
  const [gameData,setGameData] = useState()
  const [gameDocId,setGameDocId] = useState(props.gameDocumentId)

  const [gameCode,setGameCode] = useState()
  const [board,setBoard] = useState()
  //const [boar,setGameCode] = useState()


  useEffect( () => {
    setGameDocId(props.gameDocumentId)
    console.log('searching for doc: ' , gameDocId)
    console.log('props: ' + props.gameDocumentId)
    const unsubscribe = firestore.collection('Game').doc(props.gameDocumentId)
    .onSnapshot(
       doc => {
        if(!doc.empty){
          console.log('GOT data: ')
          console.log(doc.data())

         setGameData(doc.data().p1DisplayName)
         setGameCode(doc.data().gameCode)
         setBoard(doc.data().board)
      }
      else{
        console.log('failure')
          setGameData(0)
          setGameCode(0)
      }
      },
      err => {
        console.log('error')
      }
    )
    return () => unsubscribe()
     },[props.gameCode,props.gameDocumentId])

 const updateGame = async (newBoard) => {
      firestore.collection('Game').doc(gameDocId).update({board: newBoard}).then( () => {
        console.log('update Successful')
        return true
      }).catch(() => {console.log('Update Failure'); return false})
  }

   return(
    <React.Fragment>
      <ConnectFour board={board} updateGameOnline={updateGame} ></ConnectFour>
    <div>hi</div>
    <p>game data: {gameData ? gameData : null}</p>
    <p>game board: {board ? board : null}</p>
    <p>game code: {gameCode}</p>
    </React.Fragment> 
    )
}

// function OnlineConnectFour(props){
//   const gameRef =  firestore.collection('Game')
//  const query = gameRef.where('gameCode','==',props.gameCode)
//  const [value,loading,error] = useDocumentData(query,{ idField: 'id' }); 

//  return(
//   <ConnectFour></ConnectFour>
//  )
// }

export default OnlineGame

  // const connectToGame = async () => {
  //   const unsubscribe = firestore.collection('Game').where('gameCode','==',props.gameCode)
  //     .onSnapshot(
  //       doc => {
  //         console.log('got data: ')
  //         doc.docs.map(el => {
  //           console.log(el.data())
  //         })
  //         //setGameData(doc)
  //         // setGameCode(doc)
  //         // setGameData(snapshot.data().p1DisplayName)
  //       },
  //       err => {
  //         console.log('error')
  //       }
  //     )
  //     return () => unsubscribe()
    // if(!gameRef.empty){
    //   const snapshot = gameRef.docs[0]
    //   console.log(snapshot.data())
    //   setGameData(snapshot.data().p1DisplayName)
    // }
    // else{
    //   console.log('FAILED: ' + props.gameCode)
    //  console.log('FAILED to LISTEN')
    // }
 // }

// useEffect( () => {
//   setGameCode(props.gameCode)
//   connectToGame()
//   // console.log('online game:')
//   //  const unsubscribe = gameRef.onSnapshot((snapshot) => {
//   //     const gameDatas = []
//   //     snapshot.forEach( el => {gameDatas.push(el.data())})
//   //     setGameData(gameDatas)
//   //     console.log('game data: ' + gameDatas)
//    },[props.gameCode])

//     return unsubscribe()
// })

// const doc = gameRef.get().then(() => {
//   console.log('DOCUMENT' + doc)
// })
// // if(!doc.exists) {
// //   console.log('FAILED to LISTEN')
// // }
// // else{
// //   console.log('SNAPSHOT' + doc)
// // }

// gameRef.get().then((snapshot) => {
//   if(snapshot) {
//     console.log('snapshot: ' + snapshot)
//     //  snapshot.forEach(doc => {
//     //   console.log(doc.data())
//     // })

    // gameRef.onSnapshot((querySnapshot) => {
    //   console.log(querySnapshot)

    //   // querySnapshot.docs.map(doc => {
    //   //   console.log(doc.data())
    //   // })
    // })
  
//   else{
//     console.log('FAILED to LISTEN')
//   }
// })
// const unsubscribe = gamRef.where('gameCode','==',props.gameCode).get()
// const query = gameRef.where('gameCode','==',props.gameCode)
// const [value,loading,error] = useDocumentData(query,{ idField: 'id' }); 
// if (value){
//   console.log('Streaming Document: ' , value)
//}