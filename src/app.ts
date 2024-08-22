import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import router from './router/apiRouter'
import httpError from './util/httpError'
import responseMessage from './constant/responseMessage'
import globalErrorHandler from './middleware/globalErrorHandler'

const app: Application = express()

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
