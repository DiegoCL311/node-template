import "reflect-metadata";
import { Sequelize } from "sequelize-typescript";
import config from "../config/index";
import { logger } from "./logger";

import Usuario from "../models/usuario";
import Rol from "../models/roles";
import Sesion from "../models/sesion";
import Catalogo from "../models/catalogo";
import CatalogoValor from "../models/catalogoValor";

const decoratorModels = [
  Usuario,
  Rol,
  Sesion,
  Catalogo,
  CatalogoValor,
];

let sequelize: Sequelize;

const sequelizeLoader = async () => {
  sequelize = new Sequelize({
    database: config.database.database,
    username: config.database.user,
    password: config.database.password,
    host: config.database.host,
    port: Number(config.database.port),
    dialect: "mysql",
    timezone: "-07:00",
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

  logger.info("Sequelize conectado. Modelos cargados correctamente.");

  return sequelize;
};

export { sequelizeLoader, sequelize };
