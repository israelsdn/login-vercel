import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export const router = Router();

const prisma = new PrismaClient()

export async function getUsers() {
    const users = await prisma.users.findMany();
    return users;
}



const users = async (req: Request, res: Response) => {
    const users = await getUsers();

    return res.status(200).json(users)
}


router.get('/', users);
//router.post('/user/register', registerUser);
//router.post('/user/login', loginUser);
