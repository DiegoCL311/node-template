import { Sequelize } from "sequelize";
import config from "../config/index";
import User, { loadModel as loadUserModel } from "../models/user";

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

  loadUserModel(sequelize);

  return sequelize;
};

export { sequelizeLoader, sequelize };
