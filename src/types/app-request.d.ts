import { Request } from "express";
import { IUsuario } from "../models/usuario";

declare global {
  namespace Express {
    export interface Request {
      usuario?: IUsuario;
    }
  }
}
