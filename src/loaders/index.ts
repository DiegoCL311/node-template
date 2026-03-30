import expressLoader from "./express";
import swaggerLoader from "./swagger";
import { sequelizeLoader } from "./sequelize";
import { Express } from "express";

const init = async ({ expressApp }: { expressApp: Express }) => {
  await sequelizeLoader();
  await expressLoader({ app: expressApp });
  await swaggerLoader({ app: expressApp });
};

export default { init };
