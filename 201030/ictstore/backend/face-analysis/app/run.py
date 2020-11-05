from flask import Flask, request, jsonify, abort, make_response, render_template, url_for, flash, redirect
from jinja2 import Template
import time
import asyncio

from models import authenticate
from models import analysis

# static_folder：vueでビルドした静的ファイルのパスを指定
# template_folder：vueでビルドしたindex.htmlのパスを指定
api = Flask(__name__, static_folder = "./../frontend/dist/static", template_folder="./../frontend/dist")

@api.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@api.route('/auth/bounding_box', methods=['POST'])
def bounding_box():
    face_bounding_box = analysis.get_face_bounding_box_from(request.form["img"])
    return make_response(face_bounding_box)

@api.route('/auth/start', methods=['POST'])
def start():
    result = authenticate.face_auth(request.form["img"])
    return make_response(result)

# app.run(host, port)：hostとportを指定してflaskサーバを起動
if __name__ == '__main__':
    api.run(host='0.0.0.0', port=5000)