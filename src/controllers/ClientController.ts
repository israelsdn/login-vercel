import { prisma } from '@src/config'
import {
    DataAlreadyExistsError,
    DataInsufficientError,
    NotFoundError,
} from '@src/errors/ApiErrors'
import { converToIso, getFormattedDate, toCompareDates } from '@src/utils'
import { Request, Response } from 'express'

export class ClientController {
    async create(req: Request, res: Response) {
        const { nome, birthdate, telefone, email, barbeariaId } = req.body

        if (!nome) {
            throw new DataInsufficientError({
                message: 'Insert a date to schedule the service.',
            })
        }

        if (!telefone) {
            throw new DataInsufficientError({
                message: 'Insert a date to schedule the service.',
            })
        }

        if (!barbeariaId) {
            throw new DataInsufficientError({
                message: 'Insert a date to schedule the service.',
            })
        }

        const barbershopVerify = await prisma.barbearia.findUnique({
            where: { id: barbeariaId },
        })

        if (!barbershopVerify) {
            throw new NotFoundError({
                message: 'Barbershop not found',
            })
        }

        const clientVerify = await prisma.cliente.findMany({
            where: {
                nome: nome,
                telefone: telefone,
            },
        })

        if (clientVerify.length > 0) {
            throw new DataAlreadyExistsError({
                message:
                    'There is already a customer with the same name and telephone number.',
            })
        }

        const createClient = await prisma.cliente.create({
            data: {
                nome,
                telefone,
                barbeariaId,
                birthdate: converToIso(birthdate),
                email,
            },
        })

        const clientes = await prisma.cliente.findMany({
            where: {
                barbeariaId: barbeariaId,
            },
        })

        res.status(201).json({
            clientes: clientes,
            message: `Client ${createClient.nome} created successfully`,
        })
    }

    async update(req: Request, res: Response) {
        const { id, nome, birthdate, telefone, email } = req.body

        if (!id) {
            throw new DataInsufficientError({ message: 'Insert id' })
        }

        const updateClient = await prisma.cliente.update({
            where: {
                id: id,
            },
            data: {
                nome: nome,
                birthdate: new Date(birthdate).toISOString(),
                telefone: telefone,
                email: email,
            },
        })

        const clientes = await prisma.cliente.findMany({
            where: {
                barbeariaId: updateClient.barbeariaId,
            },
        })

        res.status(200).json({
            clientes: clientes,
            message: `${updateClient.nome} changed successfully`,
        })
    }

    async delete(req: Request, res: Response) {
        const { id } = req.body

        if (!id) {
            throw new DataInsufficientError({ message: 'Insert id' })
        }

        const deleteClient = await prisma.cliente.delete({
            where: {
                id: id,
            },
        })

        res.status(204).json({
            message: `Client ${deleteClient.nome} was deleted`,
        })
    }

    async find(_req: Request, res: Response) {
        const client = await prisma.cliente.findMany()
        res.status(200).json(client)
    }

    async findByBarbershopID(req: Request, res: Response) {
        const { barbeariaId } = req.params

        if (!barbeariaId) {
            throw new DataInsufficientError({
                message: 'Not found a barbeariaId in the params.',
            })
        }

        const clientsByBarbershopID = await prisma.cliente.findMany({
            where: { barbeariaId: +barbeariaId },
        })

        res.status(200).json(clientsByBarbershopID)
    }

    async clientsPerBarber(req: Request, res: Response) {
        const { barbeariaId } = req.params

        const formattedDate = getFormattedDate()

        const transactionsToday = await prisma.caixa.findMany({
            where: {
                createdAt: { gte: formattedDate },
                AND: { barbeariaId: +barbeariaId },
            },
        })

        const clientsPerBarber: {
            [barber: string]: { clients: number; barberID: number }
        } = {}

        transactionsToday.forEach(transaction => {
            if (
                Object.keys(clientsPerBarber).includes(
                    transaction.barbeiroId.toString()
                )
            ) {
                clientsPerBarber[`${transaction.barbeiroId}`] = {
                    clients:
                        clientsPerBarber[`${transaction.barbeiroId}`].clients +
                        1,
                    barberID: transaction.barbeiroId,
                }

                return
            }

            clientsPerBarber[`${transaction.barbeiroId}`] = {
                clients: 1,
                barberID: transaction.barbeiroId,
            }
        })

        const clientsPerBarberArray = Object.values(clientsPerBarber)

        const clientsPerBarberWithBarberName: {
            barberName: string
            clienntsCount: number
        }[] = []

        for (const clientsBarber of clientsPerBarberArray) {
            const barber = await prisma.barbeiro.findUnique({
                where: { id: clientsBarber.barberID },
            })

            if (barber?.nome) {
                clientsPerBarberWithBarberName.push({
                    barberName: barber.nome,
                    clienntsCount: clientsBarber?.clients,
                })
            }
        }

        res.status(200).json(clientsPerBarberWithBarberName)
    }

    async listClients(req: Request, res: Response) {
        const { barbeariaId } = req.params

        const clients = await prisma.cliente.findMany({
            where: { barbeariaId: +barbeariaId },
        })

        res.status(200).json(clients)
    }

    async getBirthdayPersonOfTheDay(req: Request, res: Response) {
        const { barbeariaId } = req.params

        const clients = await prisma.cliente.findMany({
            where: { barbeariaId: +barbeariaId },
        })

        const birthdayPersonOfTheDay = clients?.filter(client => {
            const birthdate = client?.birthdate as Date
            return toCompareDates(birthdate)
        })

        res.status(200).json(birthdayPersonOfTheDay)
    }
}
