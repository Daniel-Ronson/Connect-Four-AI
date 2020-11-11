from app import app, games
from flask import request, jsonify
from flask_api import status, exceptions
from flask_cors import CORS, cross_origin
import numpy as np


cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
import json

@app.route('/index')
def index():
    return app.send_static_file('index.html')

# ex url /test/teststring
# shows how to get query parameters ?param1=danny&param2=student
@app.route('/test/<string:data>',methods=['GET'])
def test(data):
    print(data)
    param1 = request.args.get('param1')

    if param1 is not None:
        print(param1)
        return param1, status.HTTP_200_OK
    else:
        return 'error', status.HTTP_404_NOT_FOUND  


# Game starts in react App board is initialized to null
# React App passes in board data to this method
# this method makes a move with the AI, updates the board state, and passes it back to react app
# React APp updates board on the front end
@app.route('/game',methods=['POST'])
@cross_origin()
def game():    
    # Convert json to dict
    parameters = json.loads(request.data)
    # parameters = {'board': '[[2,1,1,2,2,1,null],[1,2,1,1,2,2,null]] ..........'}

    # Convert board into a list
    board = parameters['board']
    board = json.loads(board)
    print(board)

    # Create New Connect Four Game
    c4 = games.ConnectFour(6,7,4)
    state = c4.initial

    #get movelist
    moves = c4.getMoves(board)

    #Convert board to readable state for AI algorithm
    numpy_board = np.array(board)

    # Find Xs and Y's
    player_x = np.where(numpy_board == 1)
    player_y = np.where(numpy_board == 2)
    # tuple(arr[1,2,4], arr[0,2,1])

    # Build state of board so that AI function can process it 
    newBoard = {}
    for x,y in zip(player_x[0],player_x[1]):
        newBoard.update({(x+1,y+1) : 'X'})
    for x,y in zip(player_y[0],player_y[1]):
        newBoard.update({(x+1,y+1) : 'Y'})
    print(newBoard)

    # set board 

    initialState = games.GameState(to_move=('Y'),
                         utility=0,  board=newBoard, moves=moves)

    move = games.alpha_beta_cutoff_player(c4, initialState)

    print(moves)
    print(move)

    response  =  json.dumps({'row':move[0]-1,'column':move[1]-1})
    return response, status.HTTP_200_OK


