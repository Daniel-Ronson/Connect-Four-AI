from app import app
from flask import request, jsonify
from flask_api import status, exceptions

@app.route('/')
@app.route('/index')
def index():
    return "Hello, World!"

# ex url /test/teststring
# shows how to get query parameters ?param1=danny&param2=student
@app.route('/test/<string:data>',methods=['GET'])
def test(data):
    print(data)
    param1 = request.args.get('param1')
    necessary_data_collected_properly = True
 
    if param1 is not None:
        print(param1)
        return param1, status.HTTP_200_OK
    else:
        return 'error', status.HTTP_404_NOT_FOUND  
