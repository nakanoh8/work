# -*- coding: utf-8 -*-
from flask import Flask, render_template, url_for, flash, redirect, request, make_response
from flask_cors import CORS, cross_origin
import json

from models import faceanalysis
from config.config import config

api = Flask(__name__)
CORS(api, support_credentials=True)

@api.route('/auth', methods=['POST'])
def auth():
    data = json.loads(request.data.decode('utf-8'))
    result_json = faceanalysis.auth(
                    data["img"],
                    data["threshold"]
                    )
    # 認証画像を保存
    faceanalysis.saveImage(data["img"], config["auth_images_dir"], result_json)
    return make_response(result_json)

@api.route('/facedetection', methods=['POST'])
def facedetection():
    data = json.loads(request.data.decode('utf-8'))
    result_json = faceanalysis.contains_face_in(data["img"])
    return make_response(result_json)

@api.route('/boundingbox', methods=['POST'])
def boundingbox():
    data = json.loads(request.data.decode('utf-8'))
    bb = faceanalysis.boundingbox(data["img"])
    return make_response(bb)
