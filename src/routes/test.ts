import { Router } from "express";
import { SuccessResponse } from "../core/ApiResponse";

const app = Router();

app.get("/", (req, res) => {

    new SuccessResponse(res, "Test Route", req.usuario);
});

export default app;