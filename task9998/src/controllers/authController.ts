import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";
import { registerSchema, loginSchema } from "../validators/authSchema";
import { ZodError } from "zod";

export const register = async (req: Request, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);
    const user = await registerUser(
      validated.email,
      validated.password,
      validated.role
    );
    res.status(201).json(user);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message).join(", ") });
    }

    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);
    const { token, user } = await loginUser(validated.email, validated.password);
    res.status(200).json({ token, user });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message).join(", ") });
    }

    res.status(401).json({ message: error.message });
  }
};
