export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}