import { spawn } from 'child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationsDir = path.resolve(__dirname, '../../db/migrations')
export function runMigrations (connectionString, action) {
    return new Promise((resolve, reject) => {
        const command =  'npx'
        const args = ['dbmate', '-u' ,connectionString, '-d', migrationsDir, action]

        const child = spawn(command, args, { stdio: 'inherit', shell: true })

        child.on('close', (code) => {
            if (code === 0) resolve()
            else reject(new Error(`Migration failed with code ${code}`))
        })
    })
}