/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Request } from 'express'
import { httpError } from '../Types/types'
import responseMessage from '../constant/responseMessage'
import config from '../config/config'
import { EApplicationEnviroment } from '../constant/application'

export default (err: Error | unknown, req: Request, errorStatusCode: number = 500): httpError => {
    const errorObj: httpError = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || responseMessage.ERROR : responseMessage.ERROR,
        data: null,
        trace: err instanceof Error ? { error: err.stack } : null
    }

    //log

    // eslint-disable-next-line no-console
    console.info('CONTROLLER ERROR', { meta: errorObj })

    //Production env check

    if (config.ENV === EApplicationEnviroment.PORDUCTION) {
        delete errorObj.request.ip
        delete errorObj.trace
    }

    return errorObj
}
