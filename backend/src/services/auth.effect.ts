import { Effect } from "effect";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../repositories/user.repository.js";
import { User } from "../models/user.model.js";
import {
  InvalidCredentialsError,
  DatabaseError,
  ConfigurationError,
} from "../models/errors.model.js";

function findUser(
  email: string
): Effect.Effect<User, InvalidCredentialsError | DatabaseError> {
  return Effect.tryPromise({
    try: () => findUserByEmail(email),
    catch: (cause) => new DatabaseError(cause),
  }).pipe(
    Effect.flatMap((user) =>
      user
        ? Effect.succeed(user)
        : Effect.fail(new InvalidCredentialsError())
    )
  );
}

function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Effect.Effect<void, InvalidCredentialsError | DatabaseError> {
  return Effect.tryPromise({
    try: () => bcrypt.compare(plainPassword, hashedPassword),
    catch: (cause) => new DatabaseError(cause),
  }).pipe(
    Effect.flatMap((match) =>
      match
        ? Effect.succeed(undefined)
        : Effect.fail(new InvalidCredentialsError())
    )
  );
}

function generateToken(
  userId: string
): Effect.Effect<string, ConfigurationError> {
  return Effect.try({
    try: () => {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET não configurado.");
      return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
    },
    catch: () => new ConfigurationError(),
  });
}

export function loginUserEffect(
  email: string,
  password: string
): Effect.Effect<
  { token: string; user: Omit<User, "password"> },
  InvalidCredentialsError | DatabaseError | ConfigurationError
> {
  return findUser(email).pipe(
    Effect.flatMap((user) =>
      verifyPassword(password, user.password).pipe(
        Effect.map(() => user)
      )
    ),
    Effect.flatMap((user) =>
      generateToken(user.id).pipe(
        Effect.map((token) => {
          const { password: _, ...userWithoutPassword } = user;
          return { token, user: userWithoutPassword };
        })
      )
    )
  );
}