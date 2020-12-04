const axios = require('axios')

let baseUrl = 'http://127.0.0.1:5000/'

// Input: Current State of board
// Output: New state of board after AI makes a move

export const postBoardState = async (board, gameDifficulty) =>{
    let boardJson = JSON.stringify(board)
    let response  = await axios.post(`${baseUrl}/game`, {
                               board: boardJson,
                               mode: gameDifficulty
                            })

        // response.data = {row:6, column:2}
        let data = response.data.column
        return data 

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
