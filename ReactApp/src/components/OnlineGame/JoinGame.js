import React, { useEffect, useState} from 'react';
import AppContext from '../../AppContext'
import '../PlayerChoice/PlayerChoice.css'
function JoinGame(props){
    const [gameInput,_setInput] = useState('')
    const [gameJoined,setGameJoined] = useState(false)

    const setInput = (input) => {
        _setInput(input)
    }

    useEffect(() => {
        console.log('use effect')
        setInput(props.gameDocumentId)
        setGameJoined(props.setGameJoined)
    },[props.gameDocumentId,props.gameJoined])

    return(
        <AppContext.Consumer>
        {(context) => (
            <React.Fragment>
            <form>
                <label className="mr-2 mt-2">Enter Code: </label>
                    <input type="text" className = "mr-2" value={gameInput} onChange={e => setInput(e.target.value)}/>
                <input className={`controlPanelButton ${context.state.gameJoined===true ? 'background-green' : 'background-gray'}`} type="submit" value="Join Game" onClick={e =>{
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

// const checkIfGameExists = async (gameInput) => {
//     const gameRef = firestore.collection('Game');
//     const snapshot = await gameRef.where('gameCode','==',gameInput).get();
//     if (snapshot.empty){
//         console.log('empty')
//         return false
//     }
//     else{
//         snapshot.forEach(doc => {
//             console.log('data : ' + doc.data())
//          });    
//         return true
//     }
//     }