const { auth_vector, sequelize: sq } = require('../dbCon');

/**
 *  registerAuthVector
 *
 *  認証ベクトル情報をDBに登録する(1件)。
 *
 */
async function registerAuthVector(data) {
  let result = 0;
  // トランザクション
  const tx = await sq.transaction();
  console.log("トランザクション開始")
  try {
    await auth_vector.create(
      data
    );
  } catch (e) {
    await tx.rollback();
    throw e; // 想定外エラーに落とす
  };

  await tx.commit();
  console.log("登録完了")
  return result;
}

/**
 *  getAll
 *
 *  認証ベクトル情報全件取得
 *  resultの件数が0件の場合、登録なし
 *
 */
async function getAll() {

  // 全件取得
  const authVectorData = await auth_vector.findAll();

  const result = {};
  // 取得したデータを詰める
  for (const data of authVectorData) {
    result[data.auth_vector_id].push(data);
  }

  return result;
}

/**
 *  getByUserId
 *
 * 利用者に紐づくベクトル情報の一覧を取得
 * resultの件数が0件の場合、登録なし
 *
 */
async function getByUserId(user_id) {

  // 利用者IDでレコード検索
  const userData = await auth_vector.findAll({
    where: {
      user_id: user_id,
    },
  });
  const result = [];
  // 取得したデータを詰める
  for (const data of userData) {
    result.push(data.dataValues);
  }  
  return result;
}

module.exports.registerAuthVector = registerAuthVector;
module.exports.getAll = getAll;
module.exports.getByUserId = getByUserId;