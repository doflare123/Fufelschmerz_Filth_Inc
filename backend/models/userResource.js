module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserResource', {
    quantity: { type: DataTypes.INTEGER, defaultValue: 0 }
  });
};
