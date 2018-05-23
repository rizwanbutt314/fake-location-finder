from flask_restful import Resource, reqparse
from flask import jsonify, make_response
import copy
import sqlite3
import re
import os

import gspread
from oauth2client.service_account import ServiceAccountCredentials

from common.utils import execute_db_query, parse_request_arguments
from common.constants import BUSINESS_PARAMS, GOOGLE_SHEET_ID


def insert_sheet_data(search_params):

    # use creds to create a client to interact with the Google Drive API
    scope = ['https://spreadsheets.google.com/feeds',
             'https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name(os.getcwd()+'/static/gsheet.json', scope)
    client = gspread.authorize(creds)

    # Find a workbook by name and open the first sheet
    # Make sure you use the right name here.
    sheet = client.open_by_key(GOOGLE_SHEET_ID).sheet1

    sheet.insert_row([search_params['ip'], search_params['lat'], search_params['long']])


class BusinessList(Resource):
    def get(self):
        request_data = parse_request_arguments(BUSINESS_PARAMS)
        search_params = copy.copy(request_data)

        insert_sheet_data(search_params)
        return make_response(jsonify({
            "data": "Data Captured",
        }), 200)
