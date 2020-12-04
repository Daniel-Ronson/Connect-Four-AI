from app import app, games
from flask import request, jsonify
from flask_api import status, exceptions
from flask_cors import CORS, cross_origin
import numpy as np
import random

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
# React App updates board on the front end
@app.route('/game',methods=['POST'])
@cross_origin()
def game():
    try:    
        # Convert json to dict
        parameters = json.loads(request.data)
        # parameters = {'board': '[[2,1,1,2,2,1,null],[1,2,1,1,2,2,null]] ..........'}

        # board into a 2d array
        board = parameters['board']
        print(board)
        board_as_array = json.loads(board)
        print(board_as_array)

    # Get Difficulty setting
        difficulty = parameters['mode']
        print(difficulty)
        
        # Create New Connect Four Game
        c4 = games.ConnectFour(6,7,4)

        #get movelist from 2d array
        moves = c4.getMoves(board_as_array)

        #Convert board to readable state for AI algorithm,a dict
        newBoard =c4.convertArrayIntoBoard(board_as_array)

        initialState = games.GameState(to_move=('Y'),
                            utility=0,  board=newBoard, moves=moves)

                    #alpha_beta_cutoff_search(state, game, d=1, cutoff_test=None, eval_fn=None,2dArray):
        move = games.alpha_beta_cutoff_search(c4,initialState,2,None,None,board_as_array)
    #  print('actions: ' + str(c4.actions(initialState)))
    #  print(moves)
        print(move)

        response  =  json.dumps({'row':move[0]-1,'column':move[1]-1})
        return response, status.HTTP_200_OK
    except:
        return "error", status.HTTP_500_INTERNAL_SERVER_ERROR