const axios = require('axios')

let baseUrl = 'http://127.0.0.1:5000/'

// Input: Current State of board
// Output: New state of board after AI makes a move

export const postBoardState = (board) =>{
    let boardJson = JSON.stringify(board)
    axios.post(`${baseUrl}/game`, {
        board: boardJson
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}

// Example for get request using axios
const getResuest = () =>{

    axios.get( `${baseUrl}/game`)
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
      console.log('always executed callback');
    });    

}
