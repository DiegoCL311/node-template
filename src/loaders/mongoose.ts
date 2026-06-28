import mongoose from 'mongoose';

import config from '../config';

let mongoConnection: mongoose.Connection;

const mongooseLoader = async () => {
  const connection = await mongoose.connect(
    `mongodb://${config.database.user}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.database}`,
    {},
  );

  mongoConnection = connection.connection;

  console.log('MongoDB connected');
};

export { mongooseLoader, mongoConnection };
