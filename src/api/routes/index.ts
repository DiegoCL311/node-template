import express, { Express, Request, Response } from "express";

const app = express();

//Unprotected route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

//Protected route
app.get("/protected", (req: Request, res: Response) => {
  res.send("Protected route");
});

export default app;
