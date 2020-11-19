## 1. 顔認証サーバのOS,Pythonのバージョンについて
・Ubuntu16.04  
・Python3.5  
※Ubuntu、Pythonを最新化するとモジュールのインストール時にエラーが発生し解決できていない状況  
  →一旦、現状動作するバージョンで動作環境を構築してコミット  
  →Ubuntu、Pythonのアップデートが必要な場合は追加調査必要  


## 2. Dockerイメージのbuildとコンテナ起動手順

### 2-1. Dockerのインストール
実行環境にDockerDesktopをインストールして、dockerコマンドを使えるようにする  
※参考記事  
http://docs.docker.jp/docker-for-windows/install.html  

### 2-2. Gitプロジェクトのclone
`cd {作業ディレクトリ}`  
`git clone git@ict.co.jp:shiratori/ictstore.git` 
 
※clone済みの場合は、最新化する  

### 2-3. Dockerイメージのbuild
`cd {作業ディレクトリ}/ictstore/examinations/face_recognition`  
`docker build -t ict_store/face_recognition:1.0 .`   
 
※`docker build`コマンドの最後の`.`でカレントディレクトリの`Dockerfile`を指定している
※完了まで20~30分ほどかかります  

### 2-4. コンテナの起動
`docker run -it -v {作業ディレクトリの絶対パス}/ictstore/examinations/face_recognition/:/home/face_recognition/ -v {利用ブラウザのダウンロード保存先に設定しているディレクトリの絶対パス}:/home/downloads/ -p 3000:3000 ict_store/face_recognition:1.0 /bin/bash`  
 
※`-p`でホストPCとコンテナの`3000`ポートを共有（ポートフォワーディング） 
※`-v`で以下のディレクトリを共有（ボリューム）  
 
・作業ディレクトリ  
【ホストPC】{作業ディレクトリの絶対パス}/ictstore/examinations/face_recognition/ 
↔ 
【コンテナ】/home/face_recognition/  
 
・ダウンロードファイル（キャプチャ画像）の保存先ディレクトリ  
【ホストPC】{利用ブラウザのダウンロード保存先に設定しているディレクトリの絶対パス} 
↔ 
【コンテナ】/home/downloads/


## 3. 顔認証サーバ起動手順

### 3-1. コンテナの起動・アタッチ
※すでにコンテナに入っている場合はこの手順は不要
 
`docker ps -a` でコンテナIDを確認  
`docker start {コンテナID}`  
`docker attach {コンテナID}`  

### 3-2. flask, requests のインストール
`python3 -m pip install flask requests`  
 
※Dockerfileに追記済 
※追記前のイメージを使用している場合はこの手順が必要

### 3-3. 顔認証サーバの起動 
`python3 /home/face_recognition/app/run.py`

### 3-4. ブラウザで顔認証画面へアクセス
1) ブラウザから`http://localhost:3000/face_recognition`へアクセスする（カメラが起動する）。 
2) ブラウザがアクティブな状態で[スペースキー]を押下すると、カメラのキャプチャ画像がダウンロードされ、その画像を用いて顔認証が実行される。  
3) 数秒後にブラウザのコンソールログに顔認証結果が表示される。 


## 参考記事

### Dockerコマンド
コンテナの終了・起動・削除、イメージの作成・削除など  
https://qiita.com/Esfahan/items/52141a2ad741933d7d4c

### OpenFace動作環境作成
https://elsammit-beginnerblg.hatenablog.com/entry/2020/05/17/192559  
https://blog.goo.ne.jp/jsp_job/e/a779b628252e23a4ebcf6c857e748f2f  
