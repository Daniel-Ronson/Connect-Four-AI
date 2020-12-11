const axios = require('axios')

let baseUrl = 'https://flask-ai-v4bjg2kvta-uw.a.run.app/'

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
    //  console.log('always executed callback');
    });    

}
