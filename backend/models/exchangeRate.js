module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ExchangeRate', {
    ratePayYou: { type: DataTypes.FLOAT, allowNull: false },
    rateGetYou: {type: DataTypes.FLOAT, allowNull: false}
  });
};