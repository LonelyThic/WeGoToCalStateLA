const useSsl = process.env.DB_SSL === 'true'
const sslConfig = useSsl
    ? {
          minVersion: 'TLSv1.2',
      }
    : undefined

export const poolConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    //credential
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    //how many request can wait, 0 is infinite
    queueLimit: 0,
    //how many connections can be used simultaneously
    connectionLimit: 10,
    //how many idle connection can pool contains
    maxIdle: 10,
    //how long can a idle connection stay in the pool, 1min = 60000 milliseconds
    idleTimeout: 60000,

    ssl: sslConfig,
}
