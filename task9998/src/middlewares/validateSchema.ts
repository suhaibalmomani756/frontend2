import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type ValidationTarget = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, target: ValidationTarget = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[target]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      return res.status(500).json({ message: "Validation failed" });
    }
  };
