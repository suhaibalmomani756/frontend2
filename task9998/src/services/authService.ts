import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "../../generated/prisma";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.jwt_SECRET || "supersecret";

export const registerUser = async (
  email: string,
  password: string,
  role: Role
) => {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, role },
  });

  return { id: user.id, email: user.email, role: user.role };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};
