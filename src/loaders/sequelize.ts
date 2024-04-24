import { Sequelize } from "sequelize";
import config from "../config/index";
import { convertToObject } from "typescript";

let sequelize: Sequelize;

const sequelizeLoader = async () => {
  sequelize = new Sequelize(
    config.database.mysql.database,
    config.database.mysql.user,
    config.database.mysql.password,
    {
      host: config.database.mysql.host,
      dialect: "mysql",
    }
  );

  await sequelize.authenticate();

  console.log("Sequelize connected.");

  return sequelize;
};

export { sequelizeLoader, sequelize };
