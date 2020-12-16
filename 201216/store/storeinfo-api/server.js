const express = require('express');
const bodyParser = require("body-parser");
const db = require('./api/db/dbCon');
const logger = require('./api/common/logger');

const app = express();

const port = process.env.PORT || 8011;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require("./api/routes/storeinfoRoutes"); // Routeのインポート
routes(app); //appにRouteを設定する。

app.listen(port);

console.log("RESTful API server started on: " + port);

async function shutdown() {
  try {
    // DBクローズ
    await db.sequelize.close();
    process.exit();
  } catch (e) {
    // TODO
  }
}

// シグナルの受信時
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// unhandledRejection発生時
process.on('unhandledRejection', (err) => {
    logger.system.error(err.stack);
});

process.on('uncaughtException', (err) => {
    logger.system.error(err.stack);
});
