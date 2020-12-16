const express = require('express');
const bodyParser = require("body-parser");

const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require("./api/routes/outsidemanagerRoutes"); // Routeのインポート
routes(app); //appにRouteを設定する。

app.listen(port);

console.log("RESTful API server started on: " + port);
