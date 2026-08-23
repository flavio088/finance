export class InvalidCredentialsError {
  readonly _tag = "InvalidCredentialsError";
  readonly message = "Credenciais inválidas.";
}

export class DatabaseError {
  readonly _tag = "DatabaseError";
  constructor(readonly cause: unknown) {}
}

export class ConfigurationError {
  readonly _tag = "ConfigurationError";
  readonly message = "Configuração do servidor inválida.";
}