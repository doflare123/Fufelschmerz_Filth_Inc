module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Transaction', {
    quantity: { type: DataTypes.INTEGER, allowNull: false }
  });
};
