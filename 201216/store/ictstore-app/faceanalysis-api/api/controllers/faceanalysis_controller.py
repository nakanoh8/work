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

    # 処理開始
    print("face_recognition start.")
    # print("post param[filename]=" + request.form["filename"])

    # 認証
    data = json.loads(request.data.decode('utf-8'))
    # print("data", data)
    result_json = faceanalysis.auth(
                    data["image"],
                    data["threshold"]
                    )
    # print("result_json", result_json)
    # 認証画像を保存
    # faceanalysis.save_authimage(data["image"], config["auth_images_dir"], result_json)
    # レスポンス整形
    response = make_response(result_json) 

    # 処理終了
    print("face_recognition result :", result_json["facedetection_result"])
    print("auth_result result :", result_json["auth_result"])
    print("face_recognition end.")

    return response

@api.route('/facedetection', methods=['POST'])
def facedetection():
    data = json.loads(request.data.decode('utf-8'))
    result_json = faceanalysis.detect_face(data["image"])
    return make_response(result_json)

@api.route('/boundingbox', methods=['POST'])
def boundingbox():
    data = json.loads(request.data.decode('utf-8'))

    rgb_img = faceanalysis.load_rgbimg(data["image"])
    bb = faceanalysis.face_boundingbox(rgb_img)
    bb_for_display = faceanalysis.face_boundingbox_for_display(bb)

    return make_response(bb_for_display)

@api.route('/facevector', methods=['POST'])
def facevector():
    data = json.loads(request.data.decode('utf-8'))

    rgb_img = faceanalysis.load_rgbimg(data["image_dataurl"])
    bb = faceanalysis.face_boundingbox(rgb_img)
    face_vector = faceanalysis.face_vector(rgb_img, bb)

    return make_response({"face_vector": face_vector})

@api.route('/saveimage', methods=['POST'])
def saveimage():
    # 登録画像(利用開始情報)を保存
    save_result = faceanalysis.save_registimage(data["image"], config["regist_images_dir"])
    return make_response(save_result)