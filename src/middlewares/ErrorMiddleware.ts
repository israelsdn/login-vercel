import { NextFunction, Request, Response } from 'express'
import { ApiError } from '@src/errors/ApiErrors'

export function ErrorMiddleware(
  err: Error & Partial<ApiError>,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status: number = err.statusCode ?? 500
  const message: string = err.message ?? 'Internal server error'

  return res.status(status).json({
    status,
    message,
  })
}
