import { afterAll, beforeAll, describe, expect, it, test } from "vitest"
import { app } from "../../../app.js"
import request from "supertest"
import { createANdAuthenticateUser } from "@/utils/test/create-nd-authenticate-user.js"


describe("Search gyms (e2e)", () => {  

    beforeAll(async () => { 
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

        it("should search for a gym", async () => {
            const { token } = await createANdAuthenticateUser(app, true)

           await request(app.server)
           .post("/gyms")
           .set("Authorization", `Bearer ${token}`)
           .send({
                title: "JavaScript Gym",
                description: "Gym Description",
                phone: "123456",
                latitude: 0,
                longitude: 0,
            })

            await request(app.server)
           .post("/gyms")
           .set("Authorization", `Bearer ${token}`)
           .send({
                title: "Typescript Gym",
                description: "Gym Description",
                phone: "1234567",
                latitude: 0,
                longitude: 0,
            })

            const response = await request(app.server)
            .get("/gyms/search")
            .query({query: 'JavaScript'})
            .set('Authorization', `Bearer ${token}`)
            .send()

           expect(response.statusCode).toEqual(200)
           expect(response.body.gyms).toHaveLength(1)
            expect(response.body.gyms).toEqual([
                expect.objectContaining({
                    title: "JavaScript Gym",
                }),
            ])

    })

})