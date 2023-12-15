import { Request, Response } from 'express'

import { prisma } from '@src/config'
import { DataNotMatchError, DataInsufficientError } from '@src/errors/ApiErrors'
import { getFormattedDate } from '@src/utils'

export class CashBoxControlller {
    async create(req: Request, res: Response) {
        const {
            valor,
            forma_pagamento,
            produtos,
            barbeariaId,
            barbeiroId,
            clienteId,
        } = req.body

        if (!valor) {
            throw new DataInsufficientError({
                message: 'Insert a value for the service.',
            })
        }

        if (!barbeariaId) {
            throw new DataInsufficientError({
                message: 'Insert a barbeshop for the service.',
            })
        }

        if (!barbeiroId) {
            throw new DataInsufficientError({
                message: 'Insert a barber for the service.',
            })
        }

        if (!forma_pagamento) {
            throw new DataInsufficientError({
                message: 'Insert a payment type for the service.',
            })
        }

        if (!produtos) {
            throw new DataInsufficientError({
                message: 'Insert a products for the service.',
            })
        }

        const verifyBarberID = await prisma.barbeiro.findUnique({
            where: { id: barbeiroId },
        })

        if (!verifyBarberID) {
            throw new DataNotMatchError({
                message: 'Not found a barber with the same ID.',
            })
        }

        const verifyBarbeshopID = await prisma.barbearia.findUnique({
            where: { id: barbeariaId },
        })

        if (!verifyBarbeshopID) {
            throw new DataNotMatchError({
                message: 'Not found a barbershop with the same ID.',
            })
        }

        const cashbox = await prisma.caixa.create({
            data: {
                valor,
                forma_pagamento,
                produtos,
                barbeariaId,
                barbeiroId,
                clienteId,
            },
        })

        const timestamp = getFormattedDate()

        const setLastCut = await prisma.cliente.update({
            where: { id: clienteId },
            data: { ultimo_corte: timestamp },
        })

        res.status(201).json({ cashbox, setLastCut })
    }

    async update(req: Request, res: Response) {
        const { cashboxID, valor, forma_pagamento, produtos } = req.body

        if (!cashboxID) {
            throw new DataInsufficientError({
                message: 'Insert a cashboxID to can update',
            })
        }

        if (!valor && !forma_pagamento && !produtos) {
            throw new DataInsufficientError({
                message: 'Enter at least one parameter ',
            })
        }

        const cashbox = await prisma.caixa.update({
            where: { id: +cashboxID },
            data: { valor, forma_pagamento, produtos },
        })

        res.status(201).json({ cashbox })
    }

    async find(req: Request, res: Response) {
        const { barbeariaId } = req.params

        const result = await prisma.caixa.findMany({
            where: { barbeariaId: +barbeariaId },
            include: { cliente: true },
        })

        res.status(200).json(result)
    }

    async delete(req: Request, res: Response) {
        const { id } = req.body

        const cashboxDeleted = await prisma.caixa.delete({
            where: {
                id,
            },
        })

        res.status(204).json({ cashboxDeleted })
    }

    async getTotalToday(req: Request, res: Response) {
        const { barbeariaId } = req.params

        const formattedDate = getFormattedDate()

        const transactionsToday = await prisma.caixa.findMany({
            where: {
                createdAt: { gte: formattedDate },
                AND: { barbeariaId: +barbeariaId },
            },
        })

        let totalToday = 0

        for (const transaction of transactionsToday) {
            totalToday = totalToday + +transaction.valor
        }

        res.status(200).json({ totalToday })
    }

    async getSalesPerDay(req: Request, res: Response) {
        const { barbeariaId } = req.params

        const formattedDate = getFormattedDate()

        const transactionsToday = await prisma.caixa.findMany({
            where: {
                createdAt: { gte: formattedDate },
                AND: { barbeariaId: +barbeariaId },
            },
        })

        const salesPerDay = transactionsToday.length

        res.status(200).json({ salesPerDay })
    }

    async getMiddleTicket(req: Request, res: Response) {
        const { barbeariaId } = req.params

        const transactions = await prisma.caixa.findMany({
            where: { barbeariaId: +barbeariaId },
        })

        let totalValue = 0

        for (const transaction of transactions) {
            totalValue = totalValue + +transaction.valor
        }

        const middleTicket = totalValue / transactions.length

        res.status(200).json({ middleTicket: middleTicket.toFixed(2) })
    }
}
