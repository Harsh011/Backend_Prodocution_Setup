/* eslint-disable @typescript-eslint/no-floating-promises */
import app from './app'
import config from './config/config'
import { initRateLimiter } from './config/rate-limter'
import databseService from './service/databseService'
import logger from './util/logger'

const server = app.listen(config.PORT)
;(async () => {
    try {
        //database logic
        const connection = await databseService.connect()
        logger.info('DB CONNECTED', {
            meta: {
                CONNETION_NAME: connection.name
            }
        })

        initRateLimiter(connection)
        logger.info('RATE LIMITER INITIALIZED')

        logger.info('APPLICATION STARTED', {
            meta: {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        })
    } catch (error) {
        logger.error('APPLICATION FAILED', { meta: { error } })

        server.close((error) => {
            if (error) {
                logger.error('APPLICATION FAILED', { meta: { error } })
            }

            process.exit(1)
        })
    }
})()
