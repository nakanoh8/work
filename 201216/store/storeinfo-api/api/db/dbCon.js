const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('config');
const logger = require('../common/logger');

const db = {};
const connectionInfo = config.db;
/**
 *  dbConnect
 *
 *  DB接続処理。
 */
function dbConnect() {
  const sequelize = new Sequelize(connectionInfo);

  // models配下でループ
  const modelsPath = path.join(__dirname, 'models');
  fs.readdirSync(modelsPath).forEach((file) => {
    const model = require(path.join(modelsPath, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
}
dbConnect();

/**
 *  isAuthenticate
 *
 *  DB接続の成否判定。
 *
 *  @retrun {Boolean} DB接続の成否 (true：成功、false：失敗)
 */
async function isAuthenticate() {
  try {
    await db.sequelize.authenticate();
    return true;
  } catch (err) {
    logger.system.error(err.stack);
    return false;
  }
}

module.exports = db;
module.exports.isAuthenticate = isAuthenticate;
