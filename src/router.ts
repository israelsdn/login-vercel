import { Router } from 'express';
import { loginUser, registerUser } from './controllers/usersControllers';

export const router = Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
