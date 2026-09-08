import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as fs from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const environment = process.env.NODE_ENV || 'development'
const envPath = path.resolve(__dirname, `../../.env.${environment}`)

if(fs.existsSync(envPath)){
    const result = dotenv.config({ path: envPath })
    if(result.error) throw result.error

}
