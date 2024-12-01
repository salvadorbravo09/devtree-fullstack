import { Request, Response } from "express";
import { validationResult } from "express-validator";
import slug from "slug";
import UserModel from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";

export const createAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    const error = new Error("Un usuario con ese email ya esta registrado");
    res.status(409).json({ error: error.message });
    return;
  }

  const handle = slug(req.body.handle, "");
  const handleExists = await UserModel.findOne({ handle });

  if (handleExists) {
    const error = new Error("Nombre de usuario no disponible");
    res.status(409).json({ error: error.message });
    return;
  }

  const user = new UserModel(req.body);
  user.password = await hashPassword(password);
  user.handle = handle;

  await user.save();
  res.status(201).send("Registro Creado Correctamente");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    const error = new Error("El usuario no existe");
    res.status(404).json({ error: error.message });
    return;
  }

  const isPasswordCorrect = await checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    const error = new Error("Password incorrecto");
    res.status(401).json({ error: error.message });
    return;
  }
  res.send("Autenticado");
};
