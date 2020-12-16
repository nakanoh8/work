module.exports = (sequelize, DataTypes) => {
  const auth_vector = sequelize.define('auth_vector', {
    auth_vector_id: { type: DataTypes.INTEGER, primaryKey: true , autoIncrement: true},
    user_id: { type: DataTypes.TEXT },
    auth_vector: { type: DataTypes.JSONB },
  });

  return auth_vector;
};
