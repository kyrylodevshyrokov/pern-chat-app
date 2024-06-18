import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import status from "http-status";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    const isNotValidUserData =
      !fullName || !username || !password || !confirmPassword || !gender;

    if (isNotValidUserData) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: "Please, fill in all fields" });
    }

    if (password !== confirmPassword) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: "Passwords don't match" });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (user) {
      return res
        .status(status.CONFLICT)
        .json({ error: "Username already exists" });
    }

    const SALT_LENGTH = parseInt(process.env.SALT_LENGTH ?? "10");

    const salt = await bcryptjs.genSalt(SALT_LENGTH);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const profilePic = gender === "male" ? boyProfilePic : girlProfilePic;

    const newUser = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        gender,
        profilePic,
      },
    });

    if (newUser) {
      const { id, fullName, username, profilePic } = newUser;

      generateToken(id, res);

      res.status(status.CREATED).json({
        id,
        fullName,
        username,
        profilePic,
      });
    } else {
      res.status(status.BAD_REQUEST).json({ error: "Invalid User data" });
    }
  } catch (error: any) {
    console.log("Error in signup controller", error.message);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(status.BAD_REQUEST)
        .json({ error: "Invalid credentials" });
    }

    generateToken(user.id, res);

    res.status(status.OK).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error: any) {
    console.log("Error in login controller", error.message);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(status.OK).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log("Error in logout controller", error.message);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      return res.status(status.NOT_FOUND).json({ error: "User not found" });
    }

    const { id, fullName, username, profilePic } = user;

    res.status(status.OK).json({ id, fullName, username, profilePic });
  } catch (error: any) {
    console.log("Error in getMe controller", error.message);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};
