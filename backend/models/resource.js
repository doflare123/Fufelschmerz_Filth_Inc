module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Resource', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  });
};