import time
from datetime import date
import argparse
import cv2
import itertools
import os
import numpy as np
np.set_printoptions(precision=2)
import json
import openface
import base64

# Modelのディレクトリパスを設定
fileDir = os.path.dirname(os.path.realpath(__file__))
modelDir = os.path.join(fileDir, '/root/openface', 'models')
dlibModelDir = os.path.join(modelDir, 'dlib')
openfaceModelDir = os.path.join(modelDir, 'openface')

# 利用するModelを設定
parser = argparse.ArgumentParser()
parser.add_argument('--dlibFacePredictor', type=str, help="Path to dlib's face predictor.",
                    default=os.path.join(dlibModelDir, "shape_predictor_68_face_landmarks.dat"))
parser.add_argument('--networkModel', type=str, help="Path to Torch network model.",
                    default=os.path.join(openfaceModelDir, 'nn4.small2.v1.t7'))
parser.add_argument('--imgDim', type=int,
                    help="Default image dimension.", default=96)
parser.add_argument('--verbose', action='store_true')
args = parser.parse_args()

# 顔範囲、ランドマークの抽出に利用
align = openface.AlignDlib(args.dlibFacePredictor)
# 顔ベクトル抽出に利用
net = openface.TorchNeuralNet(args.networkModel, args.imgDim)

#------------------------------------
# 顔ベクトル取得
#------------------------------------
def to_face_vector(imgBase64):
    imgBinary = base64.b64decode(imgBase64)
    imgJpg = np.frombuffer(imgBinary, dtype=np.uint8)
    #raw image <- jpg
    bgrImg = cv2.imdecode(imgJpg, cv2.IMREAD_COLOR)

    # # 画像をBGR→RGBイメージに変換
    # bgrImg = cv2.imread(imgPath)
    # if bgrImg is None:
    #     raise Exception("Unable to load image: {}".format(imgPath))
    rgbImg = cv2.cvtColor(bgrImg, cv2.COLOR_BGR2RGB)
    # RGBイメージから顔が存在する範囲（複数の場合は1番大きい顔）を抽出
    # 顔が検出できなかった場合、Noneをreturn
    bb = align.getLargestFaceBoundingBox(rgbImg)
    if bb is None:
        return None
    # 顔のランドマークを抽出
    alignedFace = align.align(args.imgDim, rgbImg, bb,
                              landmarkIndices=openface.AlignDlib.OUTER_EYES_AND_NOSE)
    if alignedFace is None:
        raise Exception("Unable to align image: {}".format(imgPath))
    # ランドマークから顔ベクトルを抽出
    rep = net.forward(alignedFace)
    return to_array(rep)

#------------------------------------
# 顔ベクトル間の距離を取得
#------------------------------------
def distance(faceVector1, faceVector2):
    d = to_ndarray(faceVector1) - to_ndarray(faceVector2)
    return float("{:0.3f}".format(np.dot(d, d)))

#------------------------------------
# 顔ベクトルの型を変換（numpy.ndarray→array）
#------------------------------------
def to_array(ndarr):
    return ndarr.tolist()

#------------------------------------
# 顔ベクトルの型を変換（array→numpy.ndarray）
#------------------------------------
def to_ndarray(arr):
    return np.array(arr)

#------------------------------------
# [public] 顔認証
#------------------------------------
def auth(imgBase64, threshold): 
    # 認証時の撮影画像から顔ベクトル(認証ベクトル)を取得
    # NG: Noneを返却
    faceVector = to_face_vector(imgBase64)
    if faceVector is None:
        # 顔検出失敗
        return {
            "facedetection_result": False,
            "auth_result": False
            }
    # 顧客データ（JSON）を取得
    customers_json_path = "/usr/src/app/faceanalysis-api/api/config/customers.json"
    with open(customers_json_path, "r") as f:
        customers = json.load(f)

    for customer in customers["customers"]:
        d = distance(faceVector, customer["face_vector"])
        print("face_distance : ", d)
        if d <= threshold:
            # 認証成功
            return { 
                "facedetection_result": True,
                "auth_result": True, 
                "customer_id": customer["customer_id"],
                "face_distance": str(d)
                }
    # 認証失敗
    return { 
        "facedetection_result": True,
        "auth_result": False,
        }

#------------------------------------
# 顔枠の座標を取得する
#------------------------------------
def boundingbox(imgBase64):
    imgBinary = base64.b64decode(imgBase64)
    imgJpg = np.frombuffer(imgBinary, dtype=np.uint8)
    #raw image <- jpg
    bgrImg = cv2.imdecode(imgJpg, cv2.IMREAD_COLOR)
    if bgrImg is None:
        return {"x": 0, "y": 0, "w": 0, "h": 0}

    rgbImg = cv2.cvtColor(bgrImg, cv2.COLOR_BGR2RGB)
    bb = align.getLargestFaceBoundingBox(rgbImg)
    if bb is None:
        return {"x": 0, "y": 0, "w": 0, "h": 0}
    return {
        "x": bb.left(), 
        "y": bb.top(), 
        "w": bb.right() - bb.left(), 
        "h": bb.bottom() - bb.top()
        }

#------------------------------------
# 認証画像を保存する
#------------------------------------
def saveImage(imgBase64, dir, authResult):
    imgBinary = base64.b64decode(imgBase64)
    imgJpg = np.frombuffer(imgBinary, dtype=np.uint8)
    #raw image <- jpg
    img = cv2.imdecode(imgJpg, cv2.IMREAD_COLOR)
    if img is None:
        raise Exception("画像を読み込めませんでした。")

    if not authResult["auth_result"] and not authResult["facedetection_result"]:
        fileName = "ng_facedetection_{}.jpg".format(date.today())

    elif not authResult["auth_result"] and authResult["facedetection_result"]:
        fileName = "ng_auth_{}.jpg".format(date.today())

    elif authResult["auth_result"] and authResult["facedetection_result"]:
        fileName = "ok_auth_{}_{}.jpg".format(authResult["customer_id"], date.today())

    print(dir +"/"+ fileName)
    cv2.imwrite(dir +"/"+ fileName, img)

#------------------------------------
# [public] 顔検出
#------------------------------------
def contains_face_in(imgBase64):
    faceVector = to_face_vector(imgBase64)
    if faceVector is None:
        return { "facedetection_result": False }
    return { "facedetection_result": True }