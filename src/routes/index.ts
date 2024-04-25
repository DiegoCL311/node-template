import express from "express";
import test from "./test";

const app = express();

app.use("/test", test);

export default app;
