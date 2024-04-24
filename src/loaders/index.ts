import expressLoader from "./express";
import { mssqlLoader } from "./mssql";
import { mongooseLoader } from "./mongoose";
import { mysqlLoader } from "./mysql";
import { postgresLoader } from "./postgres";
import { loggerLoader } from "./logger";
import { Express } from "express";

const init = async ({ expressApp }: { expressApp: Express }) => {
  await expressLoader({ app: expressApp });
  await mssqlLoader();
  await mongooseLoader();
  await mysqlLoader();
  await postgresLoader();
  await loggerLoader();
};

export default { init };
