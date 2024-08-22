import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import router from './router/apiRouter'
import httpError from './util/httpError'
import responseMessage from './constant/responseMessage'
import globalErrorHandler from './middleware/globalErrorHandler'
import helmet from 'helmet'
import cors from 'cors'

const app: Application = express()
//helmet

app.use(helmet())
//cors
app.use(
    cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        origin: '*',
        credentials: true
    })
)
//middlewear
app.use(express.json())
app.use(express.static(path.join(__dirname, '../', 'public')))

app.use('/api/v1', router)

app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUNT('route'))
    } catch (error) {
        httpError(next, error, req, 404)
    }
})
//global Error Handler
app.use(globalErrorHandler)
export default app
