import { prisma } from '@src/config'
import {
    DataInsufficientError,
    DataNotMatchError,
    NotFoundError,
} from '@src/errors/ApiErrors'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const secret = process.env.SECRET as string

export class AuthController {
    async login(req: Request, res: Response) {
        const { login, password } = req.body

        if (!login) {
            throw new DataInsufficientError({
                message: 'Insert your login to enter.',
            })
        }

        if (!password) {
            throw new DataInsufficientError({
                message: 'Insert your password to enter.',
            })
        }

        const barbearia = await prisma.barbearia.findUnique({
            where: {
                login,
            },
        })

        if (!barbearia) {
            throw new NotFoundError({
                message: "Email or password don't match.",
            })
        }

        const passwordVerify = await bcrypt.compare(
            password,
            barbearia.senha_hash
        )

        if (!passwordVerify) {
            throw new DataNotMatchError({
                message: "Email or password don't match.",
            })
        }

        const token = jwt.sign(
            {
                id: barbearia.id,
            },
            secret,
            {
                expiresIn: '16h',
            }
        )

        const barbeiros = await prisma.barbeiro.findMany({
            where: {
                barbeariaId: barbearia.id,
            },
        })

        const produtos = await prisma.produto.findMany({
            where: {
                barbeariaId: barbearia.id,
            },
        })

        const clientes = await prisma.cliente.findMany({
            where: {
                barbeariaId: barbearia.id,
            },
        })

        const agendamentos = await prisma.agenda.findMany({
            where: {
                barbeariaId: barbearia.id,
            },
            select: {
                barbeiro: {
                    select: {
                        nome: true,
                    },
                },
                cliente: {
                    select: {
                        nome: true,
                    },
                },
                data: true,
                id: true,
            },
        })

        return res.status(200).json({
            barbeiros: barbeiros,
            produtos: produtos,
            clientes: clientes,
            token: token,
            agendamentos: agendamentos,
            barbeariaData: { id: barbearia.id, name: barbearia.name },
        })
    }

    async tokenVerify(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization']

        if (!authHeader) {
            throw new NotFoundError({
                message: "Token don't match.",
            })
        }

        try {
            jwt.verify(authHeader, secret)

            res.status(200).json({ message: 'Token valido' })

            next()
        } catch (error) {
            return res.status(404).json({ message: 'Sessão expirou' })
        }
    }
}
