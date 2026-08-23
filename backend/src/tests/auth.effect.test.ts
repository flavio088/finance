import { describe, it, expect } from "vitest";
import { Effect } from "effect";
import { InvalidCredentialsError } from "../models/errors.model.js";

// Teste isolado — sem banco de dados
// Testamos a lógica de composição do Effect

describe("Effect.ts — composição de erros", () => {
  it("deve propagar InvalidCredentialsError corretamente", async () => {
    const failingEffect = Effect.fail(new InvalidCredentialsError());

    const result = await Effect.runPromise(Effect.either(failingEffect));

    expect(result._tag).toBe("Left");
    if (result._tag === "Left") {
      expect(result.left._tag).toBe("InvalidCredentialsError");
      expect(result.left.message).toBe("Credenciais inválidas.");
    }
  });

  it("deve retornar Right em caso de sucesso", async () => {
    const successEffect = Effect.succeed({ token: "abc123", user: { id: "1" } });

    const result = await Effect.runPromise(Effect.either(successEffect));

    expect(result._tag).toBe("Right");
    if (result._tag === "Right") {
      expect(result.right.token).toBe("abc123");
    }
  });

  it("deve encadear efeitos com flatMap", async () => {
    const step1 = Effect.succeed(10);
    const step2 = (n: number) => Effect.succeed(n * 2);

    const result = await Effect.runPromise(
      step1.pipe(Effect.flatMap(step2))
    );

    expect(result).toBe(20);
  });
});