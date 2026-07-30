import { afterAll, beforeAll, describe, expect, it, test } from "vitest"
import { app } from "../../../app.js"
import request from "supertest"


describe("Register (e2e)", () => {  

    beforeAll(async () => { 
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

        it("should register a user", async () => {
            const response = await request(app.server).post("/users").send({
                name: "John Doe",
                email: "johndoeexample@gmail.com",
                password: "123456",

            })

            expect(response.statusCode).toEqual(201)

        })

    })