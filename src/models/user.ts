import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  confPassword: string;
}

// Função para criar um novo usuário
export async function createUser(
  name: string,
  email: string,
  senha_hash: string,
) {
  await prisma.users.create({
    data: {
      name,
      email,
      senha_hash,
    },
  });
}

// Função para buscar um usuario
export async function getUser(email: string) {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });
  return user;
}
