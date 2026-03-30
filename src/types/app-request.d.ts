import { Request } from "express";
import { IUsuario } from "../models/usuario";

export interface ProtectedRequest extends Request {
  usuario: IUsuario;
}
