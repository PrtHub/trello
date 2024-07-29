import { Request } from "express";
import { IUser } from "../models/user.model";

export type CustomRequest = Request & {
    user?: IUser;
  };