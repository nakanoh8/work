module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_name: { type: DataTypes.TEXT },
    user_email: { type: DataTypes.TEXT },
    user_no: { type: DataTypes.TEXT },
    user_attribute: { type: DataTypes.JSONB },
    ismanager: { type: DataTypes.BOOLEAN },
    isdeleted: { type: DataTypes.BOOLEAN },
  });

  return user;
};
