import { prisma } from '@src/config/prisma-client'
import { DataInsufficientError, NotFoundError } from '@src/errors/ApiErrors'
import { Request, Response } from 'express'

export class ProductController {
    async create(req: Request, res: Response) {
        const { nome, valor, estoque, barbeariaId } = req.body

        if (!nome) {
            throw new DataInsufficientError({ message: 'Insert nome' })
        }

        if (!valor) {
            throw new DataInsufficientError({ message: 'Insert valor' })
        }

        if (!barbeariaId) {
            throw new DataInsufficientError({ message: 'Insert barbeariaId' })
        }

        const barbershopIdVerify = await prisma.barbearia.findMany({
            where: { id: barbeariaId },
        })

        if (barbershopIdVerify.length <= 0) {
            throw new NotFoundError({ message: 'barbeariaId not found' })
        }

        const createProduct = await prisma.produto.create({
            data: {
                nome,
                valor,
                estoque,
                barbeariaId,
            },
        })

        const produtos = await prisma.produto.findMany({
            where: {
                barbeariaId: barbeariaId,
            },
        })

        console.log('oi')

        res.status(201).json({
            produtos: produtos,
            message: `Product ${createProduct.nome} created successfully`,
        })
    }

    async update(req: Request, res: Response) {
        const { id, nome, valor, estoque } = req.body

        if (!id) {
            throw new DataInsufficientError({ message: 'Insert id' })
        }

        const updateProduct = await prisma.produto.update({
            where: {
                id: id,
            },
            data: {
                nome: nome,
                valor: valor,
                estoque: estoque,
            },
        })

        const produtos = await prisma.produto.findMany({
            where: {
                barbeariaId: updateProduct.barbeariaId,
            },
        })

        res.status(200).json({
            produtos: produtos,
            message: `${updateProduct.nome} changed successfully`,
        })
    }

    async delete(req: Request, res: Response) {
        const { id } = req.body

        if (!id) {
            throw new DataInsufficientError({ message: 'Insert id' })
        }

        const deleteProduct = await prisma.produto.delete({
            where: {
                id: id,
            },
        })

        res.status(204).json({
            message: `Product ${deleteProduct.nome} was deleted`,
        })
    }

    async find(_req: Request, res: Response) {
        const products = await prisma.produto.findMany()
        res.status(200).json(products)
    }

    async findByBarbershopID(req: Request, res: Response) {
        const { barbeariaId } = req.params

        if (!barbeariaId) {
            throw new DataInsufficientError({
                message: 'Not found a barbeariaId in the params.',
            })
        }

        const productsByBarbershopID = await prisma.produto.findMany({
            where: { barbeariaId: +barbeariaId },
        })

        res.status(200).json(productsByBarbershopID)
    }
}
