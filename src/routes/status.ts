import express from "express";
import { SuccessMsgResponse } from "../core/ApiResponse";

const router = express.Router();

router.get("/", (req, res) => {
  new SuccessMsgResponse("Service is up and running").send(res);
});

export default router;
