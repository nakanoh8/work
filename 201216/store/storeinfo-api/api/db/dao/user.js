const { user, sequelize: sq } = require('../dbCon');

/**
 *  registerUser
 *
 *  利用者情報をDBに登録する(1件)。
 *
 */
async function registerUser(data) {
  let result = 0;
  // トランザクション
  const tx = await sq.transaction();
  try {
    await user.create(
      data
    ).then((record) => {
      // 登録成功したら新規採番された利用者IDを返却設定
      result = record.user_id;
    });
  } catch (e) {
    await tx.rollback();
    throw e; // 想定外エラーに落とす
  };

  await tx.commit();
  return result;
}

/**
 *  updateUser
 *
 *  利用者情報をDBに更新する。
 *
 */
async function updateUser(data,user_id) {
  // トランザクション
  const tx = await sq.transaction();
  try {
    await user.update(
      data,
      {where: {
        user_id: user_id,
      }},
    );
  } catch (e) {
    await tx.rollback();
    throw e; // 想定外エラーに落とす
  };
  
  await tx.commit();
  return true;
}

/**
 *  getuser
 *
 *  利用者情報取得(1件取得)
 *  resultが空オブジェクトの場合、登録なし
 *
 */
async function getUser(user_id) {

  // 利用者IDでレコード検索
  const userData = await user.findByPk(user_id);
  const result = {};
  // 取得したデータを詰める
  if (userData !== null) {
    result[userData.dataValues.user_id] = userData.dataValues;
  }
  return result;
}

/**
 *  getUserAll
 *
 *  利用者情報全件取得
 *  resultの件数が0件の場合、登録なし
 *
 */
async function getUserAll() {

  // 利用者IDでレコード検索
  const userData = await user.findAll();

  const result = {};
  // 取得したデータを詰める
  for (const data of userData) {
    result[data.dataValues.user_id] = data.dataValues;
  }

  return result;
}

/**
 *  getUserByCondition
 *
 *  指定された条件で利用者情報取得
 *  resultの件数が0件の場合、登録なし
 */
async function getUserByCondition(condition) {

  // 指定条件でレコード検索
  const userData = await user.findOne({
    where: condition
  });

  const result = {};
  // 取得したデータを詰める
  if (userData !== null) {
    result[userData.dataValues.user_id] = userData.dataValues;
  }
  return result;
}

module.exports.registerUser = registerUser;
module.exports.updateUser = updateUser;
module.exports.getUser = getUser;
module.exports.getUserAll = getUserAll;
module.exports.getUserByCondition = getUserByCondition;

