## faceanalysis-apiの起動手順
※`ictstore-app/Readme.md`の`2. faceanalysis-apiの起動手順`と同様

### 前提
・DockerDesktopのインストール  
・Gitプロジェクトのclone (git@ict.co.jp:shiratori/ictstore.git) 

### 1. Gitプロジェクトの最新化
`cd {Gitプロジェクトのディレクトリ}`  
`git pull`  

### 2. Dockerイメージのbuildとコンテナの起動
`cd {Gitプロジェクトのディレクトリ}/ictstore/examinations/ictstore-app/frontend`  
`docker-compose build`（※初回のみ）  
`docker-compose up -d`  
`docker-compose exec faceanalysis /bin/bash`

### 3. faceanalysis-apiの起動
`python3 /usr/src/app/faceanalysis-api/api/run.py`  


####################################################  
  顔認証APIのみの動作確認手順  
####################################################  
※「3. faceanalysis-apiの起動 」まで行えること。  

①顔ファイル配置  
`cp /home/face_recognition/app/static/sample_img/IMG_1691.JPG /home/downloads/IMG_1691.JPG`  

②顔認証サーバの起動  
`python3 /usr/src/app/faceanalysis-api/api/run.py`  

③REST送信ツール(「chrome ARC」等)を使用して下記を送信  
【メソッド】：POST  
【URL】：http://localhost:5000/auth  
【bodytype】：application/json  
【送信ボディ】：  
{  
  "img": <任意の画像のbase64文字列（ヘッダ（data:image/jpeg;base64,）を除いたもの）>,  
  "threshold": <認証時の閾値（数値）>  
}  

※画像をbase64文字列に変換できるサイト  
https://colorcodesearch.com/binary/  
※`threshold`に大きい値（3.0など）を設定すると、ユーザ未登録でも「認証成功」時のコンソール出力が可能  

④正常時のコンソール出力内容  

●認証成功時  
face_recognition start.  
threshold : 1.0  
authenticate2.  
face_distance :  1.571  
face_distance :  1.272  
face_distance :  0.739  
save auth-image. /usr/src/app/report/auth-images/success_auth_lennon-2_20201201_030731.jpg  
face_recognition result : True  
auth_result result : True  
face_recognition end.  
172.21.0.1 - - [01/Dec/2020 03:07:31] "POST /auth HTTP/1.1" 200 -  

●認証失敗時  
face_recognition start.  
threshold : 0.1  
authenticate2.  
face_distance :  1.571  
face_distance :  1.272  
face_distance :  0.739  
save auth-image. /usr/src/app/report/auth-images/failure_auth_20201201_030934.jpg  
face_recognition result : True  
auth_result result : False  
face_recognition end.  
172.21.0.1 - - [01/Dec/2020 03:09:34] "POST /auth HTTP/1.1" 200 -  

●顔検出失敗時  
face_recognition start.  
threshold : 0.1  
authenticate2.  
save auth-image. /usr/src/app/report/auth-images/failure_facedetection_20201201_032802.jpg  
face_recognition result : False  
auth_result result : False  
face_recognition end.  
172.21.0.1 - - [01/Dec/2020 03:28:02] "POST /auth HTTP/1.1" 200 -  

## 参考記事

### OpenFace動作環境作成
https://elsammit-beginnerblg.hatenablog.com/entry/2020/05/17/192559  
https://blog.goo.ne.jp/jsp_job/e/a779b628252e23a4ebcf6c857e748f2f  
