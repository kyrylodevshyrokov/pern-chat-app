import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../db/prisma.js";
import status from "http-status";

interface DecodedToken extends JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
    }
  }
}

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ error: "Unauthorized - no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ error: "Unauthorized - no token provided" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, fullName: true, profilePic: true },
    });

    if (!user) {
      return res.status(status.NOT_FOUND).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware", error.message);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export default protectRoute;
