'use strict';

require('dotenv').config();

function buildConfig(environment) {
  return {
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    logging: false,
    define: {
      timestamps: true,
    },
    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData',
  };
}

module.exports = {
  development: buildConfig('development'),
  test: buildConfig('test'),
  production: buildConfig('production'),
};
