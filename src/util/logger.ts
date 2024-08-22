/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createLogger, format, transports } from 'winston'
import 'winston-mongodb'
import util from 'util'
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports'
import config from '../config/config'
import { EApplicationEnviroment } from '../constant/application'
import path from 'path'
import * as sourceMapSupport from 'source-map-support'
import { blue, green, red, yellow, magenta } from 'colorette'
import { MongoDBTransportInstance } from 'winston-mongodb'

//linking trace support
sourceMapSupport.install()

const colorizelevel = (level: string) => {
    switch (level) {
        case 'ERROR':
            return red(level)
        case 'WARN':
            return yellow(level)
        case 'INFO':
            return blue(level)
        default:
            return level
    }
}

const consoleLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info

    const customLevel = colorizelevel(level.toUpperCase())

    const customTimeStamp = green(timestamp as string)

    const customMessage = message

    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null,
        colors: true
    })

    const customLog = `${customLevel} [${customTimeStamp}] ${customMessage}\n${magenta('META')} ${customMeta}\n`

    return customLog
})

const consoleTransport = (): Array<ConsoleTransportInstance> => {
    if (config.ENV === EApplicationEnviroment.DEVELOPMENT) {
        return [
            new transports.Console({
                level: 'info',
                format: format.combine(format.timestamp(), consoleLogFormat)
            })
        ]
    }
    return []
}

const FileLogFormat = format.printf((info) => {
    const { level, message, timestamp, meta = {} } = info

    const logMeta: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(meta)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                trace: value.stack || null
            }
        } else {
            logMeta[key] = value
        }
    }

    const logData = {
        level: level.toUpperCase(),
        message,
        timestamp,
        meta: logMeta
    }

    return JSON.stringify(logData, null, 4)
})
const fileTransport = (): Array<FileTransportInstance> => {
    return [
        new transports.File({
            filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
            level: 'info',
            format: format.combine(format.timestamp(), FileLogFormat)
        })
    ]
}
const mongoDBTransport = (): Array<MongoDBTransportInstance> => {
    return [
        new transports.MongoDB({
            level: 'info',
            db: config.DATABASE_URL as string,
            metaKey: 'meta',
            expireAfterSeconds: 3000 * 24 * 30,
            options: { useUnifiedTopology: true },
            collection: 'application-logs'
        })
    ]
}

export default createLogger({
    defaultMeta: {
        meta: {}
    },
    transports: [...fileTransport(), ...mongoDBTransport(), ...consoleTransport()]
})
