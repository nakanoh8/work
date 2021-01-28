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

import datetime
import pathlib
import csv

import face_alignment


share_dirpath = "/usr/src/app/share/"

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

fa = face_alignment.FaceAlignment(
        face_alignment.LandmarksType._2D,
        device='cpu'
    )
# print(face_alignment.LandmarksType._2D)

#------------------------------------
# 画像読み込み(BGRデータ)
#------------------------------------
def load_bgrimg(imgBase64):
    imgBinary = base64.b64decode(imgBase64)
    imgJpg = np.frombuffer(imgBinary, dtype=np.uint8)
    #raw image <- jpg
    bgrImg = cv2.imdecode(imgJpg, cv2.IMREAD_COLOR)

    return bgrImg

#------------------------------------
# [public] 画像読み込み(RGBデータ) 
# ※dlibでの画像読み込みはRGBデータを利用
#------------------------------------
def load_rgbimg(imgBase64):
    # print("get_face_vector. file:" + imgPath)

    bgrImg = load_bgrimg(imgBase64)
    if bgrImg is None:
        print("Unable to load image")
        return None

    # 画像をBGR→RGBイメージに変換
    rgbImg = cv2.cvtColor(bgrImg, cv2.COLOR_BGR2RGB)

    return rgbImg
    

#------------------------------------
# [public] 顔ベクトル変換
#------------------------------------
def face_vector(rgbImg, faceBoundingBox):
    if rgbImg is None:
        return None
    # if faceBoundingBox is None:
    #     return None
    # 顔のランドマークを抽出
    alignedFace = align.align(args.imgDim, rgbImg, [],
                              landmarks=to_array(fa.get_landmarks_from_image(rgbImg)[0]), landmarkIndices=openface.AlignDlib.OUTER_EYES_AND_NOSE)
    # print(">>>>alignedFace")
    # print(fa.get_landmarks_from_image(rgbImg)[0])
    if alignedFace is None:
        raise Exception("Unable to align image")
    # ランドマークから顔ベクトルを抽出
    rep = net.forward(alignedFace)
    return to_array(rep)

def contains_face(rgbImg):
    if rgbImg is None:
        return None
    # 顔のランドマークを抽出
    alignedFace = align.align(args.imgDim, rgbImg, None,
                              landmarkIndices=openface.AlignDlib.OUTER_EYES_AND_NOSE)
    # print(alignedFace)
    return alignedFace is not None

    # face_landmarks = fa.get_landmarks_from_image(rgbImg)
    # print(type(fa))
    # return face_landmarks is not None

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
    print("threshold :", threshold)
    print("authenticate2.")

    # 認証時の撮影画像から顔ベクトル(認証ベクトル)を取得
    # NG: Noneを返却
    rgbImg = load_rgbimg(imgBase64)
    faceBoundingBox = face_boundingbox(rgbImg)

    # alignedFace = align.align(args.imgDim, rgbImg, faceBoundingBox,
    #                           landmarkIndices=openface.AlignDlib.OUTER_EYES_AND_NOSE)
    # landmark = align.findLandmarks(rgbImg, faceBoundingBox)
    landmark = to_array(fa.get_landmarks_from_image(rgbImg)[0])
    # print(type(landmark))
    # print(landmark)
    # print(type(alignedFace))
    # print(type(imgBase64))
    # print(type(rgbImg))
    # result, alignedFace_data = cv2.imencode('.jpg', alignedFace)
    # alignedFace_base64 = base64.b64encode(alignedFace_data).decode("utf-8")
    # print(type(alignedFace_base64))
    # print(alignedFace_base64)
    authImagesPath = "/usr/src/app/report/auth-images"

    save_authimage(imgBase64, authImagesPath, { 
                "facedetection_result": True,
                "auth_result": True, 
                "user_id": None,
                "face_distance": 0
                }, landmark)
                
    faceVector = face_vector(rgbImg, faceBoundingBox)
    if faceVector is None:
        # 顔検出失敗
        # save_analysis_info(rgbImg, faceBoundingBox, faceVector, False, None)
        return {
            "facedetection_result": False,
            "auth_result": False
            }
    
    # 顧客データ（JSON）を取得
    # TODO storeInfoAPI完成、かつデータ登録後に実装
    # response = requests.get("http://localhost:8083/storeInfo/authVectors/")
    # authVectors = response.json()

    usersJsonPath = "/usr/src/app/faceanalysis-api/api/config/users.json"
    with open(usersJsonPath, "r") as f:
        users = json.load(f)

    for user in users["users"]:
        d = distance(faceVector, user["face_vector"])
        print("face_distance : ", d)
        if d <= threshold:
            # 認証成功
            # image_analysis.save_analysis_info(
            #     input_img,
            #     face_rectangle,
            #     input_img_vec,
            #     True,
            #     user["user_id"])
            # save_analysis_info(rgbImg, faceBoundingBox, faceVector, True, user["user_id"])
            return { 
                "facedetection_result": True,
                "auth_result": True, 
                "user_id": user["user_id"],
                "face_distance": str(d)
                }
    # 認証失敗
    # save_analysis_info(rgbImg, faceBoundingBox, faceVector, False, None)
    return { 
        "facedetection_result": True,
        "auth_result": False,
        }

#------------------------------------
# [public] 顔範囲情報を取得する
#------------------------------------
def face_boundingbox(rgbImg):
    # RGBイメージから顔が存在する範囲（複数の場合は1番大きい顔）を抽出
    # 顔が検出できなかった場合、Noneをreturn
    if rgbImg is None:
        return None
    return align.getLargestFaceBoundingBox(rgbImg)
    # if contains_face(rgbImg):
    #     return True
    # return None

#------------------------------------
# [public] 顔範囲情報(カメラへの顔枠描画用に加工したもの)を取得する
# #------------------------------------
def face_boundingbox_for_display(bb):
    if bb is None:
        return {"x": 0, "y": 0, "w": 0, "h": 0}
    if bb is not None:
        return {"x": 100, "y": 100, "w": 300, "h": 300}

    return {
        "x": bb.left(), 
        "y": bb.top(), 
        "w": bb.right() - bb.left(), 
        "h": bb.bottom() - bb.top()
        }

#------------------------------------
# [public] 認証画像を保存する
#------------------------------------
def save_authimage(imgBase64, dir, authResult, landmark):
    bgrImg = load_bgrimg(imgBase64)
    if bgrImg is None:
        raise Exception("画像を読み込めませんでした。")

    # ランドマーク描画
    for (i, (x, y)) in enumerate(landmark):
        cv2.circle(bgrImg, (int(x), int(y)), 1, (255, 0, 0), -1)

    currentTime = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')

    if not authResult["auth_result"] and not authResult["facedetection_result"]:
        fileName = "failure_facedetection_{}.jpg".format(currentTime)

    elif not authResult["auth_result"] and authResult["facedetection_result"]:
        fileName = "failure_auth_{}.jpg".format(currentTime)

    elif authResult["auth_result"] and authResult["facedetection_result"]:
        fileName = "success_auth_{}_{}.jpg".format(authResult["user_id"], currentTime)

    print("save auth-image.", dir +"/"+ fileName)
    cv2.imwrite(dir +"/"+ fileName, bgrImg)

#------------------------------------
# [public] 登録画像(利用開始情報)を保存する
#------------------------------------
def save_registimage(imgBase64, userId, dir):
    bgrImg = load_bgrimg(imgBase64)
    if bgrImg is None:
        raise Exception("画像を読み込めませんでした。")
    
    currentTime = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')

    fileName = "{}_{}.jpg".format(userId, currentTime)
    print("save regist-image.", dir +"/"+ fileName)
    cv2.imwrite(dir +"/"+ fileName, bgrImg)

    return { "result": "success" }

#------------------------------------
# [public] 顔検出
#------------------------------------
def detect_face(imgBase64):
    rgbImg = load_rgbimg(imgBase64)
    faceBoundingBox = face_boundingbox(rgbImg)
    faceVector = face_vector(rgbImg, faceBoundingBox)
    if faceVector is None:
        return { "facedetection_result": False }
    return { "facedetection_result": True }

#------------------------------------
# 分析情報保存
#------------------------------------
def save_analysis_info(rgbImg, face_rect, face_vector, result, result_id):
    analysis_date = datetime.datetime.now()
    
    # print("---------------------")
    # print(imgPath)
    # print(face_rect)
    # print(face_rect.left())
    # print(face_vector)
    # print(result)
    # print(result_id)
    # print(analysis_date.strftime('%Y%m%d'))
    # print(analysis_date.strftime('%Y%m%d_%H%M%S'))
    
    # 保存先ディレクトリ作成
    saveDir = pathlib.Path(share_dirpath + "analysis_info/" + analysis_date.strftime('%Y%m%d') + "/")
    saveDir.mkdir(parents=True, exist_ok=True)
    
    # 認証結果ID 生成
    recog_id = "cam0001" + "_" + analysis_date.strftime('%Y%m%d_%H%M%S')
    
    if face_rect is not None:
        face_rectangle_data = { "p1": { "x":face_rect.left(), "y":face_rect.top() }, "p2": { "x":face_rect.right(), "y":face_rect.bottom() }}
    
    # 詳細json保存
    json_data = {
        "recog_id" : recog_id,
        "face_rectangle" : face_rectangle_data,
        "face_vector" : face_vector,
        "face_recog_date" : analysis_date.strftime('%Y%m%d_%H%M%S'),
        "face_recog_result" : result,
        "face_recog_result_id" : result_id
    }
    with open(str(saveDir.joinpath(recog_id + ".json")), 'w') as outfile:
        json.dump(json_data, outfile, indent=2)
        
    # サマリCSV追記
    with open(str(saveDir.joinpath(analysis_date.strftime('%Y%m%d') + ".csv")), mode='a') as f:
        csv_data = [
            json_data["recog_id"],
            json.dumps(json_data["face_rectangle"]),
            json_data["face_recog_date"],
            json_data["face_recog_result"],
            json_data["face_recog_result_id"]
        ]
        writer = csv.writer(f)
        writer.writerow(csv_data)
    
    # 画像保存
    # rgbImg = load_rgbimg(imgBase64)
    bgrImg = cv2.cvtColor(rgbImg, cv2.COLOR_RGB2BGR)
    cv2.rectangle(bgrImg, (face_rect.left(), face_rect.top()), (face_rect.right(), face_rect.bottom()), (255, 0, 0))
    cv2.imwrite(str(saveDir.joinpath(recog_id + ".png")), bgrImg)


print("test")
img = cv2.imread("/usr/src/app/faceanalysis-api/api/config/users_image/lennon-2.jpg")
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
# print(rgb)
print(face_vector(rgb, []))
# print(fa.face_alignment_net)
height, width, channels = img.shape[:3]
print("width: " + str(width))
print("height: " + str(height))
print("channels: " + str(channels))