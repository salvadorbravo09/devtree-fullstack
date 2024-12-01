export type User = {
  handle: string;
  name: string;
  email: string;
};

export type RegisterForm = Pick<User, "handle" | "email" | "name"> & {
  password: string;
  password_confirmation: string;
};
