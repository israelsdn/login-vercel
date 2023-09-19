import { IUser, createUser, getUser } from '../models/user';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
require('dotenv').config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user: IUser = req.body;

    //Validação dos dados
    if (!user.name || !user.email || !user.password || !user.confPassword) {
      return res.status(422).json({ msg: 'Dados insuficientes' });
    }

    if (user.confPassword != user.password) {
      return res.status(400).json({ msg: 'As senhas não coincidem' });
    }

    const userVerify = await getUser(user.email);

    if (userVerify) {
      return res
        .status(409)
        .json({ msg: `O email: ${user.email} já está sendo utilizado` });
    }

    //Criptografando a senha
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(user.password, salt);

    //Inserindo dados no banco de dados
    createUser(user.name, user.email, senha_hash);

    return res
      .status(201)
      .json({ msg: `Usuario ${user.name} criado com sucesso` });
  } catch (error) {
    return res.status(500).json({ msg: 'algo inesperado aconteceu' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //Validação de dados
    if (!email || !password) {
      return res.status(422).json();
    }

    const user = await getUser(email);

    if (!user) {
      return res.status(401).json();
    }

    //Verificando senha
    const passwordVerify = await bcrypt.compare(password, user.senha_hash);

    if (!passwordVerify) {
      return res.status(401).json();
    }

    // Gerando token
    const secret = process.env.SECRET as string;

    const token = jwt.sign(
      {
        id: user.id,
      },
      secret,
    );

    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json('algo inesperado aconteceu');
  }
};
