from app import app
from flask import request, jsonify
from flask_api import status, exceptions
from flask_cors import CORS, cross_origin
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

# 
# Game starts in react App board is initialized to null
# React App passes in board data to this method
# this method makes a move with the AI, updates the board state, and passes it back to react app
# React APp updates board on the front end
@app.route('/game',methods=['POST'])
@cross_origin()
def game():
    parameters = json.loads(request.data)
    print(parameters)
    board = parameters['board']
    response  =  json.dumps(board)
    print("in Game: " + board)
    return response, status.HTTP_200_OK


