import { Router, Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../core/ApiResponse";
import { NoDataError } from "../core/ApiError";
import authMiddleware from "../middlewares/authMiddleware";
import asyncErrorHandler from "../utils/asyncErrorHandler";

const app = Router();

app.get(
  "/error",
  asyncErrorHandler((req: Request, res: Response) => {
    throw new NoDataError();
    res.send("Hello World");
  })
);

app.get("/", (req: Request, res: Response) => {
  new SuccessResponse(res, JSON.stringify(req.user ?? "NOOO"), req.user);
});

// Endpoint using the async handler
app.get(
  "/wrapAsync",
  authMiddleware,
  asyncErrorHandler(async (req: Request, res: Response) => {
    new SuccessResponse(res, JSON.stringify(req.user ?? "NOOO"), req.user);
  })
);

app.get("/noWrapAsync", (req: Request, res: Response) => {
  new SuccessResponse(res, JSON.stringify(req.user ?? "NOOO"), req.user);
});

export default app;
