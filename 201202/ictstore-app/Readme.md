## 1. frontendサーバの起動・動作確認手順

### 前提
・DockerDesktopのインストール  
・Gitプロジェクトのclone (git@ict.co.jp:shiratori/ictstore.git) 

### 1-1. Gitプロジェクトの最新化
`cd {Gitプロジェクトのディレクトリ}`  
`git pull`  

### 1-2. Dockerイメージのbuildとコンテナの起動
`cd {Gitプロジェクトのディレクトリ}/ictstore/examinations/ictstore-app/frontend`  
`docker-compose build`（※初回のみ）  
`docker-compose up -d`  
`docker-compose exec frontend /bin/sh`  

### 1-3. node_modulesのインストール
`cd /usr/src/app/frontend`  
`npm i`  

### 1-4. 開発環境の実行・動作確認
`npm run dev`   
  
ブラウザから`http://localhost:8000/`にアクセスできれば完了  

### 1-5. コンテナの停止
`docker-compose down`  

### 備考. Eslintによる.js/.vueファイルのフォーマット
`node node_modules/eslint/bin/eslint.js --ext .js,.vue src --fix`  

上記のコマンドを実行することで.js/.vueファイルがフォーマットされ、Eslint関連のエラーが消える  
※ファイル保存時に自動フォーマットできるように対応中



## 2. faceanalysis-apiの起動手順

### 前提
・DockerDesktopのインストール  
・Gitプロジェクトのclone (git@ict.co.jp:shiratori/ictstore.git) 

### 2-1. Gitプロジェクトの最新化 (※1-1の手順を実施済の場合は不要)
`cd {Gitプロジェクトのディレクトリ}`  
`git pull`  

### 2-2. Dockerイメージのbuildとコンテナの起動
`cd {Gitプロジェクトのディレクトリ}/ictstore/examinations/ictstore-app/frontend`  
`docker-compose build`（※初回のみ）  
`docker-compose up -d` 
※↑ 1-1~2の手順を実施済の場合は不要  
`docker-compose exec faceanalysis /bin/bash`

### 2-3. faceanalysis-apiの起動
`python3 /usr/src/app/faceanalysis-api/api/run.py`  



## 3. レポート関連データの出力について

顔認証サーバの以下のディレクトリにレポート関連データを出力する。  
`/usr/src/app/report`  
  
## /usr/src/app/report/auth-images  
認証時に撮影した画像の保存用ディレクトリ  
  
●ファイル名  
認証成功画像：`success_auth_<CUSTOMER-ID>_<%Y%m%d_%H%M%S>.jpg`  
認証失敗画像：`failure_auth_<%Y%m%d_%H%M%S>.jpg`  
検出失敗画像：`failure_facedetection_<%Y%m%d_%H%M%S>.jpg`  

## /usr/src/app/report/regist-images  
利用開始情報として登録された顔画像の保存用ディレクトリ  
  
●ファイル名  
`<CUSTOMER-ID>_<%Y%m%d_%H%M%S>.jpg`    