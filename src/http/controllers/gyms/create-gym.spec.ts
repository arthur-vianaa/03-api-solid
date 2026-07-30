import { afterAll, beforeAll, describe, expect, it, test } from "vitest"
import { app } from "../../../app.js"
import request from "supertest"
import { createANdAuthenticateUser } from "@/utils/test/create-nd-authenticate-user.js"


describe("Create gym (e2e)", () => {  

    beforeAll(async () => { 
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

        it("should create a gym", async () => {
            const { token } = await createANdAuthenticateUser(app, true)

           const response = await request(app.server)
           .post("/gyms")
           .set("Authorization", `Bearer ${token}`)
           .send({
                title: "Gym Name",
                description: "Gym Description",
                phone: "123456",
                latitude: 0,
                longitude: 0,
            })

           expect(response.statusCode).toEqual(201) 

    })

})