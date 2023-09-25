import express from 'express';
import { router } from './router';
import cors from 'cors';
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'https://israelsdn.live',
  }),
);
app.use(router);

app.listen(process.env.PORT);
