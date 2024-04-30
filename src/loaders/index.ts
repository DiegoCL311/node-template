import expressLoader from "./express";
import { mssqlLoader } from "./mssql";
import { mongooseLoader } from "./mongoose";
import { mysqlLoader } from "./mysql";
import { postgresLoader } from "./postgres";
import { loggerLoader } from "./logger";
import { sequelizeLoader } from "./sequelize";
import { Express } from "express";

const init = async ({ expressApp }: { expressApp: Express }) => {
  await loggerLoader();
  await sequelizeLoader();
  //await mongooseLoader();
  //await postgresLoader();
  //await mysqlLoader();
  //await mssqlLoader();
  await expressLoader({ app: expressApp });
};

export default { init };
