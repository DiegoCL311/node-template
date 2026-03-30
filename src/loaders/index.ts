import expressLoader from "./express";
import swaggerLoader from "./swagger";
import { sequelizeLoader } from "./sequelize";
import { Express } from "express";
import { loggerLoader } from "./logger";

const init = async ({ expressApp }: { expressApp: Express }) => {
  await loggerLoader()
  await sequelizeLoader();
  await swaggerLoader({ app: expressApp });
  await expressLoader({ app: expressApp });
};

export default { init };
