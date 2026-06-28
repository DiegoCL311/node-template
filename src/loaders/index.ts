import { Express } from 'express';

import bannerLoader from './banner';
import expressLoader from './express';
import { loggerLoader } from './logger';
import { sequelizeLoader } from './sequelize';
import swaggerLoader from './swagger';

const init = async ({ expressApp }: { expressApp: Express }) => {
  await bannerLoader();
  await loggerLoader();
  await sequelizeLoader();
  await swaggerLoader({ app: expressApp });
  await expressLoader({ app: expressApp });
};

export default { init };
