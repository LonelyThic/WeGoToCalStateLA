import {MySqlContainer} from "@testcontainers/mysql";
import {createPool} from "mysql2/promise";
import {runMigrations} from "./migrateContainer.mjs";
import {RedisContainer} from "@testcontainers/redis";
import Redis from "ioredis";
import {redisConfig} from "../../src/config/redisConfig.mjs";


export async function setup(){
    let sqlContainer = await new MySqlContainer('mysql:8.0.36')
        .withDatabase("wegoapp")
        .withUsername("tester")
        .withUserPassword("123456")
        .start()
    const connectionURL = sqlContainer.getConnectionUri()
    await runMigrations(connectionURL, 'up')
    let connectionPool = await createPool({
        uri: connectionURL
    })
    return connectionPool

}

export async function setupRedis(){
    let redisContainer = await new RedisContainer("redis:8.6.1")
        .start()
    const connectionURL = redisContainer.getConnectionUrl()
    return connectionURL
}