import './ConnectFour.css'
import React from 'react';
import {postBoardState} from '../../Requests/ConnectFourRequest'
import AppContext from '../../AppContext'

import firebase from '../../Firebase/Firebase' 
const auth = firebase.auth();
const firestore = firebase.firestore();


class ConnectFour extends React.Component {
//    uid  = auth.currentUser;
//    dummy = useRef();
//    messagesRef = firestore.collection('messages');
//  // const query = messagesRef.where('uid','==',uid).limit(5)
  // query = messagesRef.orderBy('createdAt').equalTo()
////  const query = messagesRef.orderByChild('uid').equalTo(uid).limitToLast(5);

//   [messages] = useCollectionData(query, { idField: 'id' });

    constructor(props) { 
      super(props);
      
      this.state = {
        player1: 1,
        player2: 2,
        shuffledUsed: false,
        currentPlayer: null,
        board: [],
        gameOver: false,
        message: '',
        gameType: 'singlePlayer',
        gameDifficulty: 'easy',
        winningCoordinates: []
      };
      
      // Bind play function to App component
      this.play = this.play.bind(this);
    }
    
     setCoordinates(coordinates){
      // coordinates = [[1,2],[3,4]]
                //let winningCoordinates = Object.assign({}, prevState.winningCoordinates)
        let coords = [...this.state.winningCoordinates]
        coordinates.map(el => coords.push(el))
        this.setState({
          winningCoordinates: coords
        })  
    }

    // Starts new game
    initBoard() {
      // Create a blank 6x7 matrix
      let board = [];
      for (let r = 0; r < 6; r++) {
        let row = [];
        for (let c = 0; c < 7; c++) { row.push(null) }
        board.push(row);
      }
      
      this.setState({
        board,
        currentPlayer: this.state.player1,
        gameOver: false,
        message: '',
        winningCoordinates: [],
        shuffledUsed: false
      });
    }
    
    togglePlayer(togglePlayer = this.state.currentPlayer ) {
      return ( this.state.currentPlayer  === this.state.player1) ? this.state.player2 : this.state.player1;
    }

    

    makeMove(c,board,currentPlayer=this.state.currentPlayer){
        // Place piece on board
        for (let r = 5; r >= 0; r--) {
          if (!board[r][c]) {
            board[r][c] = currentPlayer;
            return board;
          }
        }
    }
    
    checkBoard(board){
      return new Promise(resolve => {
      let result = this.checkAll(board);
      if (result === this.state.player1) {
        this.setState({ board, gameOver: true, message: 'Red player wins!' }, () => resolve());
      } else if (result === this.state.player2) {
        this.setState({ board, gameOver: true, message: 'Yellow player wins!' }, () => resolve());
      } else if (result === 'draw') {
        this.setState({ board, gameOver: true, message: 'Draw game.' }, () => resolve());
      } 
    })
  }
  
    async play(gameType,gameDifficulty,c, gameCode, gameJoined) {

      // Single Player or Online Game
      if (!this.state.gameOver && ( (gameType == 'singlePlayer' && this.state.currentPlayer === 1) || (gameType === 'multiPlayer') || (gameType === 'onlineGame' && gameJoined===true))) {

        // Place piece on board
        let board = this.state.board;
        board = this.makeMove(c,board)

        // Check status of board
        let result = this.checkAll(board);
        if (result === this.state.player1) {
          this.setState({ board, gameOver: true, message: 'Red Player wins!' });
        } else if (result === this.state.player2) {
          this.setState({ board, gameOver: true, message: 'Yellow Player wins!' });
        } else if (result === 'draw') {
          this.setState({ board, gameOver: true, message: 'Draw game.' });
        } 
        
        // Game continues
        else if(this.state.gameOver === false) {

          // setState is asynchronous so I define toggle_player as a local variable 
          let toggle_player = this.togglePlayer()
          this.setState({ board, currentPlayer: toggle_player });  

          // Call AI algorithm if Single Player game
          if(gameType === 'singlePlayer' && toggle_player === this.state.player2){
            console.log(gameDifficulty)
            let ai_move_column = await postBoardState(board,gameDifficulty)  // Make call to AI algorithm
            board = this.makeMove(ai_move_column,board,toggle_player)
            this.setState({ board, currentPlayer: this.state.player1});
            await this.checkBoard(this.state.board)
          }

          // Online Game
          else if (gameType === "onlineGame"){
            await this.props.updateGameOnline(JSON.stringify(this.state.board))
          }

        }
      } else if(this.state.gameOver == true) {
        this.setState({ message: 'Please start a new game.' });
      }

    }

     checkVertical(board) {
      // Check only if row is 3 or greater
      for (let r = 3; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
          if (board[r][c]) {
            if (board[r][c] === board[r - 1][c] &&
                board[r][c] === board[r - 2][c] &&
                board[r][c] === board[r - 3][c]) {
              this.setCoordinates([[r,c],[r-1,c],[r-2,c],[r-3,c]])
              return board[r][c];    
            }
          }
        }
      }
    }
    
     checkHorizontal(board) {
      // Check only if column is 3 or less
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
          if (board[r][c]) {
            if (board[r][c] === board[r][c + 1] && 
                board[r][c] === board[r][c + 2] &&
                board[r][c] === board[r][c + 3]) {
                  this.setCoordinates([[r,c],[r,c+1],[r,c+2],[r,c+3]])
              return board[r][c];
            }
          }
        }
      }
    }
    
    checkDiagonalRight(board) {
      // Check only if row is 3 or greater AND column is 3 or less
      for (let r = 3; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
          if (board[r][c]) {
            if (board[r][c] === board[r - 1][c + 1] &&
                board[r][c] === board[r - 2][c + 2] &&
                board[r][c] === board[r - 3][c + 3]) {
                  this.setCoordinates([[r,c],[r-1,c+1],[r-2,c+2],[r-3,c+3]])
              return board[r][c];
            }
          }
        }
      }
    }
    
    checkDiagonalLeft(board) {
      // Check only if row is 3 or greater AND column is 3 or greater
      for (let r = 3; r < 6; r++) {
        for (let c = 3; c < 7; c++) {
          if (board[r][c]) {
            if (board[r][c] === board[r - 1][c - 1] &&
                board[r][c] === board[r - 2][c - 2] &&
                board[r][c] === board[r - 3][c - 3]) {
                this.setCoordinates([[r,c],[r-1,c-1],[r-2,c-2],[r-3,c-3]])
              return board[r][c];
            }
          }
        }
      }
    }
    
    checkDraw(board) {
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
          if (board[r][c] === null) {
            return null;
          }
        }
      }
      return 'draw';    
    }
    
    checkAll(board) {
      return this.checkVertical(board) || this.checkDiagonalRight(board) || this.checkDiagonalLeft(board) || this.checkHorizontal(board) || this.checkDraw(board);
    }

    shuffleBoard()
    {
        this.state.shuffledUsed = true;
        var allTokensInBoard = [];
        let board = this.state.board;

        console.log(this.state.board)

        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 7; c++) {
            if (board[r][c] != null) {
                allTokensInBoard.push(board[r][c])
                board[r][c] = null
              }
            }
          }
        console.log("This is the temp:" + allTokensInBoard)
       for(let i = 0; i < allTokensInBoard.length; i++)
       {
         this.makeMove(Math.floor((Math.random() *7)),board,allTokensInBoard[i]);
       }
       let toggle_player = this.togglePlayer()
       this.setState({currentPlayer: toggle_player });  
       this.setState({board: this.state.board});
       this.checkBoard(board);
    }
    
    UNSAFE_componentWillMount() {
      this.initBoard();
    }
    
    render() {
      //console.log(this.props.games)
      let board = [...this.state.board]; //2d array tracking player moves
      let winningCoordinates = [...this.state.winningCoordinates] //2d array containing tuples of coordinates
      let button
      let shuffleButton
      if(this.state.gameOver === false && this.state.shuffledUsed == false){
        shuffleButton = <div className="shuffleButton" title = "This will take up your turn" onClick={() => {this.shuffleBoard()}}>Shuffle</div>          
        
      }     
      button = <div className="newGameButton" onClick={() => {this.initBoard()}}>New Game</div>
      let index = 0

      return (
        <AppContext.Consumer>
        {(context) => (
        <div>
          <div className="pt-3">{button}</div>
          <table className="gameBoard"> 
            <thead>
            </thead>
            <tbody>
              {board.map((row, i) => (<Column index = {index++} key={i} row={row} play={this.play} winningCoordinates = {winningCoordinates}/>))}
            </tbody>
          </table>
          {(context.state.experimentalFlag == true) && shuffleButton }
          <p className="message">{this.state.message}</p>
        </div>
        )}
        </AppContext.Consumer>
      );
    }
  }
  
  // Column component
  const Column = ({ index, row, play, winningCoordinates }) => {
    let rowIndex = 0
    return (
      <tr>
        {row.map((cell, i) => <Cell key={i} column= {index} row = {rowIndex++} value={cell} columnIndex={i} play={play} winningCoordinates = {winningCoordinates}/>)}
      </tr>
    );
  };
  
  const Cell = ({ column, row,value, columnIndex, play, winningCoordinates}) => {

    let flag = false
    if(winningCoordinates.length > 0){
      winningCoordinates.forEach(el =>{
        let y = el[0]
        let x= el[1]
        if(column === y && row === x){
          flag = true
        }      
      })
    }

  let color = '';
   if (value === 1) {
      color = flag === true? 'shiny-red': 'red-background' 
    } else if (value === 2) {
      color = flag === true? 'shiny-yellow': 'yellow-background' 
    }
     
    return (
      <AppContext.Consumer>
      {(context) => (
      <td>
        {
          // context.state.gameType == "onlineGame" && 
          // <div className="cell" onClick={() => {onlinePlay(context.state.gameType, context.state.gameMode, columnIndex, context.state.gameCode, context.state.onlineGameJoined)}}>
          //   <div className= {`square ${color}`} ></div>
          // </div>
        }
      
        <div className="cell" onClick={() => {play(context.state.gameType, context.state.gameMode, columnIndex, context.state.gameCode, context.state.onlineGameJoined)}}>
            <div className= {`square ${color}`} ></div>
        </div>
  
      </td>
      )}
      </AppContext.Consumer>
    );
  };
  
export default ConnectFour