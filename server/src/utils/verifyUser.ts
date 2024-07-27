import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler";
import { IUser } from "../models/user.model";

declare module 'express-serve-static-core' {
    interface Request {
      user?: IUser;
    }
  }

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.trello_token;

  if (!token) return next(errorHandler(401, 'Token is missing, unauthorized access.'));

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return next(errorHandler(403, 'Invalid or expired token.'));

    req.user = user as IUser
    next();
  });
};
