import { Router } from 'express'

import {
    BarberController,
    BarbershopController,
    CashBoxControlller,
    ClientController,
    ProductController,
    SchedulingController,
} from '@src/controllers'
import { AuthController } from '@src/controllers/AuthController'

export const routes = Router()

routes.post('/create-barbershop', new BarbershopController().create)
routes.get('/find-barbershops', new BarbershopController().find)
routes.put('/alter-password', new BarbershopController().update)
routes.delete('/delete-barbershop', new BarbershopController().delete)

routes.post('/create-barber', new BarberController().create)
routes.get('/find-barber', new BarberController().find)
routes.put('/alter-barber', new BarberController().update)
routes.delete('/delete-barber/:id', new BarberController().delete)
routes.get('/find-barber/:barbeariaId', new BarberController().findByID)
routes.get(
    '/find-top-barber/:barbeariaId',
    new BarberController().findTopBarber
)

routes.post('/create-product', new ProductController().create)
routes.get('/find-product', new ProductController().find)
routes.put('/alter-product', new ProductController().update)
routes.delete('/delete-product', new ProductController().delete)
routes.get(
    '/find-products/:barbeariaId',
    new ProductController().findByBarbershopID
)

routes.post('/create-cashbox', new CashBoxControlller().create)
routes.put('/update-cashbox', new CashBoxControlller().update)
routes.get('/find-cashbox/:barbeariaId', new CashBoxControlller().find)
routes.delete('/delete-cashbox', new CashBoxControlller().delete)
routes.get(
    '/total-cashbox-today/:barbeariaId',
    new CashBoxControlller().getTotalToday
)
routes.get(
    '/get-middle-ticket/:barbeariaId',
    new CashBoxControlller().getMiddleTicket
)
routes.get(
    '/sales-per-day/:barbeariaId',
    new CashBoxControlller().getSalesPerDay
)

routes.post('/create-scheduler', new SchedulingController().create)
routes.put('/update-scheduler', new SchedulingController().update)
routes.get('/find-scheduler/:barbeariaId', new SchedulingController().find)
routes.delete('/delete-scheduler', new SchedulingController().delete)

routes.post('/create-client', new ClientController().create)
routes.put('/update-client', new ClientController().update)
routes.get('/find-client', new ClientController().find)
routes.delete('/delete-client', new ClientController().delete)
routes.get(
    '/find-client/:barbeariaId',
    new ClientController().findByBarbershopID
)
routes.get(
    '/clients-per-barber/:barbeariaId',
    new ClientController().clientsPerBarber
)
routes.get('/list-clients/:barbeariaId', new ClientController().listClients)
routes.get(
    '/get-birthday-person-of-the-day/:barbeariaId',
    new ClientController().getBirthdayPersonOfTheDay
)

routes.post('/auth', new AuthController().login)
routes.post('/tokenVerify', new AuthController().tokenVerify)
