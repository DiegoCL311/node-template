import { Request } from "express";
import { IUser } from "../models/user/IUser";

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}
