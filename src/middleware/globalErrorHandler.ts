/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { httpError } from '../Types/types'

export default (err: httpError, _: Request, res: Response, __: NextFunction) => {
    res.status(err.statusCode).json(err)
}
