import '../config/module-alias'

import express, { Application } from 'express'
import cors from 'cors'
import 'express-async-errors'
import { routes } from '@src/routes'
import { ErrorMiddleware } from '@src/middlewares/ErrorMiddleware'
export class App {
    public app: Application

    constructor() {
        this.app = express()
        this.middlewaresInitialize()
    }

    private middlewaresInitialize() {
        this.app.use(express.json())
        this.app.use(cors())
        this.app.use(routes)
        this.app.use(ErrorMiddleware)
    }

    listen() {
        this.app.listen(process.env.PORT, () =>
            console.log('This server is running 🚀')
        )
    }
}
