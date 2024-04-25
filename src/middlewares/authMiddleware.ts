import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user/IUser";
import { AuthFailureError } from "../core/ApiError";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get the JWT token from the request headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AuthFailureError(
      "No hay token de autenticación en la solicitud."
    );
  }

  try {
    // Verify and decode the JWT token
    // const decodedToken = jwt.verify(token, "your-secret-key");

    // Extend the request object with the decoded token
    req.user = {
      id: "1", //(decodedToken as IUser).id,
      email: "2", //(decodedToken as IUser).email,
    };

    next();
  } catch (error) {
    next(new AuthFailureError("Token de autenticación inválido."));
  }
};

export default authMiddleware;
