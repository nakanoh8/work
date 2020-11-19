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