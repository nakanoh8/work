module.exports = function(app) {
  var controller = require('../controllers/storeinfoController');

  app.route('/storeInfo/users')
    .post(controller.createUser);

  app.route('/storeInfo/users/:user_id/AuthenticationVector')
    .post(controller.createAuthVector);

  app.route('/storeInfo/users/:user_id')
    .get(controller.getUserById);

  app.route('/storeInfo/users')
    .get(controller.getAllUser);

  app.route('/storeInfo/users/:wherekey/:wherevalue')
    .get(controller.getUserByConditions);

  app.route('/storeInfo/authVectors')
    .get(controller.getAllAuthVector);
};