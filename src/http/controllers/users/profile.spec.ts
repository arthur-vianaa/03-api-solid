import { afterAll, beforeAll, describe, expect, it, test } from "vitest"
import { app } from "../../../app.js"
import request from "supertest"
import { createANdAuthenticateUser } from "@/utils/test/create-nd-authenticate-user.js"


describe("Profile (e2e)", () => {  

    beforeAll(async () => { 
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

        it("get user profile", async () => {
            const { token } = await createANdAuthenticateUser(app)

           const profileResponse = await request(app.server)
           .get("/me")
           .set("Authorization", `Bearer ${token}`)
           .send()

           expect(profileResponse.statusCode).toEqual(201) // TODO: corrigir para 200
           expect(profileResponse.body.user).toEqual(
            expect.objectContaining({
                email: "johndoeexample@gmail.com",
            }),
        )

    })

})