import { Router } from "express";
import asyncErrorHandler from "../utils/asyncErrorHandler";
import testController from "../controllers/test/test";

const app = Router();

app.get("/", asyncErrorHandler(testController.test));


export default app;