import { RequestHandler, Router } from "express";
import { register, login } from "../controllers/authController";
import { validate } from "../middlewares/validateSchema";
import { registerSchema, loginSchema } from "../validators/authSchema";
const router = Router();

router.post(
  "/register",
  validate(registerSchema) as RequestHandler,
  register as RequestHandler
);
router.post(
  "/login",
  validate(loginSchema) as RequestHandler,
  login as RequestHandler
);

export default router;
