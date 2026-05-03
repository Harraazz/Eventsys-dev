import { Request, Response } from "express";
import { signIn, signUp, getProfile } from "../services/auth.service";


export const userSignup = async (req: Request, res: Response) => {
  try {
    const { email, password, referralCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await signUp(email, password, referralCode);

    return res.status(201).json({
      message: "Register success",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }

}

export const userSignin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await signIn(email, password);

    return res.status(200).json({
      message: "Login success",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getProfileController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await getProfile(userId);

    return res.json({
      message: "Profile fetched",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};