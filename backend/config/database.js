const { Sequelize } = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize(
  process.env.BD_post_uri,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true, // Для использования SSL
        rejectUnauthorized: false, // Если ты уверен в безопасности
      },
    },
    logging: false,
  }
);