const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user')(sequelize, Sequelize);
const Resource = require('./resource')(sequelize, Sequelize);
const UserResource = require('./userResource')(sequelize, Sequelize);
const BankResource = require('./bankResource')(sequelize, Sequelize);
const ExchangeRate = require('./exchangeRate')(sequelize, Sequelize);
const Transaction = require('./transaction')(sequelize, Sequelize);
const ExchangeRateHistory = require('./ExchangeRateHistory')(sequelize, Sequelize);

// Associations
User.hasMany(UserResource);
UserResource.belongsTo(User);

Resource.hasMany(UserResource);
UserResource.belongsTo(Resource);

Resource.hasMany(BankResource);
BankResource.belongsTo(Resource);

ExchangeRate.belongsTo(Resource, { as: 'fromResource', foreignKey: 'fromResourceId' });
ExchangeRate.belongsTo(Resource, { as: 'toResource', foreignKey: 'toResourceId' });

Transaction.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Transaction.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });
Transaction.belongsTo(Resource);

ExchangeRate.hasMany(ExchangeRateHistory, { foreignKey: 'exchangeRateId' });
ExchangeRateHistory.belongsTo(ExchangeRate, { foreignKey: 'exchangeRateId' });


module.exports = {
  sequelize,
  User,
  Resource,
  UserResource,
  BankResource,
  ExchangeRate,
  Transaction,
  ExchangeRateHistory
};