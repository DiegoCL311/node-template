import { Request } from "express";
import { IUser } from "../models/usuario";

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}
