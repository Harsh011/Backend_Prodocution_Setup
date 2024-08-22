/* eslint-disable no-console */
const { exec } = require('child_process')

//Command line Arguments
const command = process.argv[2]
const migrationName = process.argv[3]

//valid migration command
const validCommands = ['create', 'up', 'down', 'list', 'prune']
if (!validCommands.includes(command)) {
    console.error(`Invalid Command: Command must be one of ${validCommands}`)
    process.exit(0)
}

const commandsWithMigrationNameRequired = ['list', 'prune']
if (!commandsWithMigrationNameRequired.includes(command)) {
    if (!migrationName) {
        console.error(`Migration name is required`)
        process.exit(0)
    }
}

function runNpmScript() {
    return new Promise((resolve, reject) => {
        let execommand = ''

        if (commandsWithMigrationNameRequired.includes(command)) {
            execommand = `migrate ${command}`
        } else {
            execommand = `migrate ${command} ${migrationName}`
        }

        const childProcess = exec(execommand, (error, stdout) => {
            if (error) {
                reject(`Error runing script ${error}`)
            } else {
                resolve(stdout)
            }
        })
        childProcess.stderr.on('data', (data) => {
            console.error(data)
        })
    })
}

//Example Usage
runNpmScript()
    .then((output) => {
        console.info(output)
    })
    .catch((error) => {
        console.error('Error: ', error)
    })
