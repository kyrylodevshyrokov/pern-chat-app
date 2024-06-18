import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (userId: string, res: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

  const token = jwt.sign({ userId }, JWT_SECRET!, {
    expiresIn: TOKEN_EXPIRATION,
  });

  const tokenMaxAge = 15 * 24 * 60 * 60 * 1000;

  res.cookie("jwt", token, {
    maxAge: tokenMaxAge,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

export default generateToken;
