import mongoose from "mongoose";
import config from "../config";

let mongoConnection: mongoose.Connection;

const mongooseLoader = async () => {
  const connection = await mongoose.connect(config.database.mongo.uri, {});

  mongoConnection = connection.connection;

  console.log("MongoDB connected");
};

export { mongooseLoader, mongoConnection };
