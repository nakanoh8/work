# -*- coding: utf-8 -*-
from flask import Flask, request, make_response, render_template, url_for
from flask_cors import CORS, cross_origin
# from . import service

api = Flask(__name__)
CORS(api, support_credentials=True)

@api.route('/', methods=['GET'])
def index():
    # return render_template('index.html')
    return "GET"

# @api.route('/capture_img', methods=['POST'])
# def capture_img():
#     msg = service.save_img(request.form["img"])
#     return make_response(msg)

@api.route('/test', methods=['POST'])
def test():
    print("############")
    print(request.form["test"])
    res = request.form["test"]
    return make_response({"test": res + " :::OK"})