■起動方法
・コンソールでPJフォルダに移動
・下記のコマンドを実行
> npm install
> node server.js

■スピーカAPI.一覧取得

実行例.
ブラウザで下記URLを開く。
http://localhost:8080/gates
{"sesami0001":{"id":"00001","setting1":"aaa","setting2":"aaa"}}


■スピーカAPI.発話要求

実行例.
ブラウザで下記URLを開く。
http://localhost:8080/gates/sesami0001/lock
{"gate_id":"0000"}
http://localhost:8080/gates/sesami0001/unlock
{"gate_id":"0000"}


