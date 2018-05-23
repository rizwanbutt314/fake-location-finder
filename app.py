from flask import Flask, request, render_template
from flask_restful import Resource, Api
import sqlite3

from views.view_businesslist import BusinessList


app = Flask(__name__)
api = Api(app)

# Routes
api.add_resource(BusinessList, '/officers-data', endpoint="officers-data")

@app.route('/')
def result():
   return render_template('index.html', search_type = {'dumm': 'eve'})



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=9000, debug=True, threaded=True)
