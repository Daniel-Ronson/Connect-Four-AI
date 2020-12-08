import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AppContext from './AppContext'

class AppProvider extends Component {
  state = {
    gameType: 'singlePlayer',
    gameMode: 'easy',
    experimentalFlag: false,
    gameCode: null,
    onlineGameJoined: false,
    onlineGameCanBeJoined: false,
    gameDocumentId: null,
    isOnline: false,
    gameJoined: false
  }


  render() {
    return (
      <AppContext.Provider value={{
        state: this.state,
        setGameType: (game) => this.setState({
          gameType: game
        }),
        setGameDifficulty: (mode) => this.setState({
          gameMode: mode
        }),
        setExperimentalFlag: () => this.setState({
          experimentalFlag: this.state.experimentalFlag === false ? true : false
        }),
        setGameCode: (game) => this.setState({
          gameCode: game,
          onlineGameJoined: this.state.onlineGameJoined === false ? true : false,
          gameType: "onlineGame"
        }),
        joinOnlineGame: (flag) => this.setState({
          onlineGameCanBeJoined: flag
        }),
        setGameDocumentId: (docRef) => this.setState({
          gameDocumentId: docRef
        }),
        toggleIsOnline: () => this.setState({
          isOnline: this.state.isOnline === false ? true : false
        }),
        toggleGameJoined: (flag) => this.setState({
          gameJoined: flag
        })

      }}>
        {this.props.children}
        {console.log('Mode: ' + this.state.gameType)}
        {console.log('gameCode State: ' + this.state.gameCode)}
        {console.log('Doc Ref: ' + this.state.gameDocumentId)}
        {console.log('Online Mode: ' + this.state.isOnline)}
        {console.log('')}


      </AppContext.Provider>
    )
  }
}
ReactDOM.render(
  <AppProvider>
    <App />
    </AppProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
