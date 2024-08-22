import app from './app'
import config from './config/config'
import logger from './util/logger'

const server = app.listen(config.PORT)
;(() => {
    try {
        //database logic

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
