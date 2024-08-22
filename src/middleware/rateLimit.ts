import { NextFunction, Request, Response } from 'express'
import config from '../config/config'
import { EApplicationEnviroment } from '../constant/application'
import { rateLimiterMongo } from '../config/rate-limter'
import httpError from '../util/httpError'
import responseMessage from '../constant/responseMessage'

export default (req: Request, _: Response, next: NextFunction) => {
    if (config.ENV === EApplicationEnviroment.DEVELOPMENT) {
        return next()
    }
    if (rateLimiterMongo) {
        rateLimiterMongo
            .consume(req.ip as string)
            .then(() => {
                next()
            })
            .catch(() => {
                httpError(next, new Error(responseMessage.TO_MANY_REQUEST), req, 429)
            })
    }
}
