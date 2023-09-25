import { Router } from 'express';
import {
  loginUser,
  registerUser,
  tokenVerify,
} from './controllers/usersControllers';

export const router = Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.post('/user/token', tokenVerify);
