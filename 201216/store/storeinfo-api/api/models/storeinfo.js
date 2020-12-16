const user = require('../db/dao/user');
const authVector = require('../db/dao/auth_vector');

module.exports = {

    regUser: async function(user_id, regData) {
        let result = {};
        // 初期化
        result.resultStatus = 200;
        result.data = {};
        result.data.user_id = user_id;
        // 登録済みかチェック
        if (user_id !== null) {
            // 対象の管理番号が登録済みの場合要求エラー
            const userData = await user.getUserByCondition({user_no: regData.user_no});
            if (Object.keys(userData).length !== 0){
                result.resultStatus = 400
            } else {
                // 登録
                const newuser_id = await user.registerUser(regData)
                // 採番結果の利用者ID設定
                result.data.user_id = newuser_id;
            }
        } else {
            // 更新
            await user.updateuser(regData, user_id);
        }
        return result;
    },
    regAuthVector: async function(regData) {
        let result = {};
        // 初期化
        result.resultStatus = 200;
        // 登録
        await authVector.registerAuthVector(regData)
        return result;
    },

    readUserId: async function (user_id) {
        let result = {};
        // 初期化
        result.resultStatus = 200;
        result.data = {};

        // 利用者テーブルオブジェクト参照し、user_idで指定された1件を取得する。
        const userData = await user.getUser(user_id);
        // 結果返却制御
        // 取得できた場合は、その結果を返す、無い場合は中身が空でステータスコード404返す。
        if (Object.keys(userData).length == 0){
            //エラー処理
            result.resultStatus = 404;
        } else {
            // 配列結合
            const vectorData = await authVector.getByUserId(user_id);
            userData[user_id].vectorInfoList = vectorData;
            result.data = userData;
        };
        // 結果返却
        return result;
    },

    readAllUser: async function () {
        let result = {};
        // 初期化
        result.resultStatus = 200;
        result.data = {};

        // 利用者テーブル全件取得
        userDataList = await user.getUserAll();
        console.log(userDataList)

        // 結果返却制御
        // 取得できた場合は、その結果を返す、無い場合は中身が空でステータスコード404返す。
        if (Object.keys(userDataList).length == 0){
            //エラー処理
            result.resultStatus = 404;
            return result;
        }
        for (const id of Object.keys(userDataList)) {
            // 認証ベクトル情報全件とっとくのと利用者1件ごとに見るのどっちが早いか･･･
            // もしくはLEFT JOINでとってくる方が早いかも(要改善)
            const vectorData = await authVector.getByUserId(id);
            userDataList[id].vectorInfoList = vectorData;
            result.data[id] = userDataList[id]
        }
        // 結果返却
        return result;
    },


    readUserByConditions: async function (condition) {
        let result = {};
        // 初期化
        result.resultStatus = 200;
        result.data = {};

        // 利用者テーブルから1件取得
        const userData = await user.getUserByCondition(condition);

        // 結果返却制御
        // 取得できた場合は、その結果を返す、無い場合は中身が空でステータスコード404返す。
        if (Object.keys(userData).length == 0){
            //エラー処理
            result.resultStatus = 404;
        } else {
            // 配列結合
            const user_id = Object.keys(userData)[0];
            const vectorData = await authVector.getByUserId(user_id);
            userData[user_id].vectorInfoList = vectorData;
            result.data = userData;
        };
        // 結果返却
        return result;
    },

    readAuthVectors: async function () {
        let result = {};
        // 初期化
        result.resultStatus = 200;
        result.resultAuthVectors = {};

        // 全件取得
        result.resultAuthVectors = await authVector.getAll();

        // 登録なしは404エラー
        if (result.resultAuthVectors.length === 0) {
            result.resultStatus = 404;
        }
        return result;
    },

}