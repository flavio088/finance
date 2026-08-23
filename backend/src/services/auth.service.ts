import bcrypt from "bcrypt";
import { CreateUserDTO, User } from "../models/user.model.js";
import { findUserByEmail, createUser } from "../repositories/user.repository.js";

const SALT_ROUNDS = 10;

export async function registerUser(data: CreateUserDTO): Promise<Omit<User, "password">> {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("E-mail já cadastrado.");
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}