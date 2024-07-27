import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { errorHandler } from "../utils/errorHandler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {fullname, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(errorHandler(400, "User already exists"));
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({fullname, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(400, "User not found"));
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return next(errorHandler(401, "Invalid password!"));

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);

    res.cookie("trello_token", token, {
      httpOnly: true,
      secure: true
    });

    res.json({ message: "Signin successful" });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('trello_token');
    res.json({ message: 'Sign out successfully' });
};

// export const google = async () => {};
