import express, { Express, Request, Response } from "express";

import { NoDataError } from "../../core/ApiError";
import { SuccessMsgResponse } from "../../core/ApiResponse";

const app = express();

//Unprotected route
app.get("/error", (req: Request, res: Response) => {
  throw new NoDataError();
  res.send("Hello World");
});

app.get("/", (req: Request, res: Response) => {
  new SuccessMsgResponse(res, "Hello World");
});

export default app;
