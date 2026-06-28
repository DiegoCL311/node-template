import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';

import { logger } from './logger';
import config from '../config/index';
import Catalogo from '../database/models/catalogo';
import CatalogoValor from '../database/models/catalogoValor';
import Rol from '../database/models/roles';
import Sesion from '../database/models/sesion';
import Usuario from '../database/models/usuario';

const decoratorModels = [Usuario, Rol, Sesion, Catalogo, CatalogoValor];

let sequelize: Sequelize;

const sequelizeLoader = async () => {
  sequelize = new Sequelize({
    database: config.database.database,
    username: config.database.user,
    password: config.database.password,
    host: config.database.host,
    port: Number(config.database.port),
    dialect: 'mysql',
    timezone: '-07:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      connectTimeout: 60000,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  });

  sequelize.addModels(decoratorModels);

  await sequelize.authenticate();
  await sequelize.query(`SET time_zone = '-07:00'`);

  logger.info('Sequelize conectado. Modelos cargados correctamente.');

  return sequelize;
};

export { sequelizeLoader, sequelize };
