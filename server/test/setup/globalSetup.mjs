import dotenv from "dotenv";
import {MySqlContainer} from "@testcontainers/mysql";
import {RedisContainer} from "@testcontainers/redis";

dotenv.config({ path: ".env.test" });

process.env.NODE_ENV ||= "test";

let sqlContainer
let redisContainer

export async function setup() {
    sqlContainer = await new MySqlContainer("mysql:8.0.36")
        .withRootPassword("test")
        .start()
    process.env.DB_HOST = sqlContainer.getHost()
    process.env.DB_PORT = sqlContainer.getPort()
    process.env.DB_USERNAME = "root"
    process.env.DB_PASSWORD = sqlContainer.getRootPassword()

    redisContainer = await new RedisContainer("redis:8.6.1").start()
    process.env.REDIS_URL = redisContainer.getConnectionUrl()

}

export async function teardown(){
    redisContainer.stop()
    sqlContainer.stop()
}
