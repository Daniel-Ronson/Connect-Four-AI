import React, { useEffect, useState, useContext } from 'react';
import AppContext from '../../AppContext'
import firebase from '../../Firebase/Firebase' 

const firestore = firebase.firestore();

function JoinGame(props){
    const [gameInput,_setInput] = useState()
    const appContext = useContext(AppContext)
    const setInput = (input) => {
        _setInput(input)
    }

    //  Like ComponentDidMount(), only runs whenprops.gameCode changes, because of optional array as parameter
    useEffect(() => {
        console.log('use effect')
        setInput(props.gameDocumentId)
    },[props.gameDocumentId])

    const checkIfGameExists = async (gameInput) => {
        const gameRef = firestore.collection('Game');
        const snapshot = await gameRef.where('gameCode','==',gameInput).get();
        if (snapshot.empty){
            console.log('empty')
            return false
        }
        else{
            snapshot.forEach(doc => {
                console.log('data : ' + doc.data())
             });    
            return true
        }
        }
    return(
        <AppContext.Consumer>
        {(context) => (
            <React.Fragment>
            <form>
                <label className="mr-2">Enter Code: </label>
                    <input type="text" value={gameInput} onChange={e => setInput(e.target.value)}/>
                <input type="submit" value="Join Game" onClick={e =>{
                    e.preventDefault()
                   // context.setGameCode(gameInput)
                    context.setGameType('onlineGame')
                    context.setGameDocumentId(gameInput)
                }} />
            </form>
        </React.Fragment>
        )}
        </AppContext.Consumer>

    )
}

export default JoinGame;