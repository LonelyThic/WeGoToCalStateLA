import { defineConfig } from "vitest/config";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
export default defineConfig({
    test: {
        globalSetup: ["./test/setup/globalSetup.mjs"],
        setupFiles:["./test/setup/setup.mjs"],
        hookTimeout: 60000,
        testTimeout: 10000,
        maxWorkers:15,
        isolate:true
    },
});