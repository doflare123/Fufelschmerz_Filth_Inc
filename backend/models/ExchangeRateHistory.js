module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ExchangeRateHistory', {
    rate: { type: DataTypes.FLOAT, allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  });
};