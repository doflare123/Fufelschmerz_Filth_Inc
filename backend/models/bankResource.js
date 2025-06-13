module.exports = (sequelize, DataTypes) => {
  return sequelize.define('BankResource', {
    quantity: { type: DataTypes.INTEGER, defaultValue: 0 }
  });
};