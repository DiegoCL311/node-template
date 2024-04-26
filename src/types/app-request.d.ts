import { Request } from "express";
import { IUser } from "../models/user";

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}
