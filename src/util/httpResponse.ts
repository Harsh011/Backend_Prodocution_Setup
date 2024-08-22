 
 
import { Request, Response } from 'express'
import { httpResponse } from '../Types/types'
import config from '../config/config'
import { EApplicationEnviroment } from '../constant/application'
import logger from './logger'

export default (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown = null): void => {
    const response: httpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: responseMessage,
        data: data
    }

    //log

    logger.info('CONTROLLER RESPONSE', { meta: response })

    //produnction env check
    if (config.ENV === EApplicationEnviroment.PORDUCTION) {
        delete response.request.ip
    }
    res.status(responseStatusCode).json(response)
}
