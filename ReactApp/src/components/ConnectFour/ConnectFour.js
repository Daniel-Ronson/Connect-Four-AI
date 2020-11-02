import './ConnectFour.css'
import React, { Component } from 'react';
import {postBoardState} from '../../Requests/ConnectFourRequest'
class ConnectFour extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        player1: 1,
        player2: 2,
        currentPlayer: null,
        board: [],
        gameOver: false,
        message: '',
        gameType: 'singlePlayer'
      };
      
      // Bind play function to App component
      this.play = this.play.bind(this);
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
        message: ''
      });
    }
    
    togglePlayer() {
      return (this.state.currentPlayer === this.state.player1) ? this.state.player2 : this.state.player1;
    }
    
    play(c) {

      if (!this.state.gameOver) {
        // Place piece on board
        let board = this.state.board;
        for (let r = 5; r >= 0; r--) {
          if (!board[r][c]) {
            board[r][c] = this.state.currentPlayer;
            break;
          }
        }
  
        // Check status of board
        let result = this.checkAll(board);
        if (result === this.state.player1) {
          this.setState({ board, gameOver: true, message: 'Player 1 (red) wins!' });
        } else if (result === this.state.player2) {
          this.setState({ board, gameOver: true, message: 'Player 2 (yellow) wins!' });
        } else if (result === 'draw') {
          this.setState({ board, gameOver: true, message: 'Draw game.' });
        } 
        
        // Game continues
        else {
          this.setState({ board, currentPlayer: this.togglePlayer() });

          // Call AI algorithm if Single Player game
          if(this.state.gameType == 'singlePlayer'){
            postBoardState(board)  // Make call to AI algorithm
          }

        }
      } else {
        this.setState({ message: 'Game over. Please start a new game.' });
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
    
    componentWillMount() {
      this.initBoard();
    }
    
    render() {
      let button
      if(this.state.gameOver == true){
        button = <div className="button" onClick={() => {this.initBoard()}}>New Game</div>          
      }
      else{
        button = <div>Game in Progress</div>
      }
      return (
        <div>
          {button}        
          <table>
            <thead>
            </thead>
            <tbody>
              {this.state.board.map((row, i) => (<Row key={i} row={row} play={this.play} />))}
            </tbody>
          </table>
          
          <p className="message">{this.state.message}</p>
        </div>
      );
    }
  }
  
  // Row component
  const Row = ({ row, play }) => {
    return (
      <tr>
        {row.map((cell, i) => <Cell key={i} value={cell} columnIndex={i} play={play} />)}
      </tr>
    );
  };
  
  const Cell = ({ value, columnIndex, play }) => {
    let color = '';
    if (value === 1) {
      color = 'red-background';
    } else if (value === 2) {
      color = 'yellow-background';
    }
      
    return (
      <td>
        <div className="cell" onClick={() => {play(columnIndex)}}>
          <div className= {`square ${color}`} ></div>
        </div>
      </td>
    );
  };
  
export default ConnectFour