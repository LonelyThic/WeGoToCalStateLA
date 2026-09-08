import "./config/loadEnv.mjs"
import { createApp } from './app/app.mjs'
import connectionPool from "./lib/pool.mjs";
import {redis} from "./lib/redis.mjs";
import {createEmailService} from "./services/auth/email/emailService.mjs";

const emailService = createEmailService()
const app = createApp(connectionPool, redis, emailService)
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Express server running at http://localhost:${port}/`);
});