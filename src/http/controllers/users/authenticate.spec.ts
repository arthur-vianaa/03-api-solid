import { afterAll, beforeAll, describe, expect, it, test } from "vitest"
import { app } from "../../../app.js"
import request from "supertest"


describe("Authenticate (e2e)", () => {  

    beforeAll(async () => { 
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

        it("should authenticate a user", async () => {
            await request(app.server).post("/users").send({
                name: "John Doe",
                email: "johndoeexample@gmail.com",
                password: "123456",
            })

            const response = await request(app.server).post("/sessions").send({
                email: "johndoeexample@gmail.com",
                password: "123456",
            })

            expect(response.statusCode).toEqual(200)
            expect(response.body).toEqual(
    expect.objectContaining({
        token: expect.any(String),
    })
)

        })

    })