■起動方法
・コンソールでPJフォルダに移動
・下記のコマンドを実行
> npm install
> node server.js

■スピーカAPI.一覧取得

実行例.
ブラウザで下記URLを開く。
http://localhost:8080/speakers
{"googlehome0001":{"id":"00001","setting1":"aaa","setting2":"aaa"}}


■スピーカAPI.発話要求

実行例.
ブラウザで下記URLを開く。
http://localhost:8080/speakers/googlehome0001/speake?message=%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AE%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%81%A7%E3%81%99%E3%80%82
{"speake_id":"0000"}


■村田君へ
・接続設定は、「conf\speakers\＜スピーカの識別ID　※任意＞.json」に適当に記載してください。
・発話はから実装にしてますので、「ict-store-server\api\models\speaker.js」のTODO箇所に実装を入れてください。
