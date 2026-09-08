import { describe, it, expect } from 'vitest'
import request from "supertest"
import {createApp} from '../../src/app/app.mjs'

describe("App health test", () => {
    it("GET /api/health -> 200", async () => {
        const app = createApp()
        const res = await request(app).get("/api/health")
        expect(res.status).toBe(200)
    })
})