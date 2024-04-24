import express, { Express, Request, Response } from "express";

import { NoDataError } from "../../core/ApiError";
import { SuccessMsgResponse, SuccessResponse } from "../../core/ApiResponse";

const app = express();

//Unprotected route
app.get("/error", (req: Request, res: Response) => {
  throw new NoDataError();
  res.send("Hello World");
});

app.get("/", (req: Request, res: Response) => {
  new SuccessResponse(res, "", {
    municipios: [],
    ciudades: [],
    departamentos: [],
    paises: [],
  });
});

export default app;
