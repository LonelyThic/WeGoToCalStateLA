import mysql from 'mysql2/promise'
import { poolConfig } from '../config/poolConfig.mjs'
//created a connection pool containes number of database connection
//good optimazation so we don't have to create a connection for each request

const connectionPool = mysql.createPool(poolConfig)

export default connectionPool
