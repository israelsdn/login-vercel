import express from 'express';
import { router } from './router';
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(router)

app.listen(process.env.PORT);