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

it("should list nearby gyms", async () => {
    const { token } = await createANdAuthenticateUser(app, true)

    const nearGym = await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Near Gym",
            description: "desc",   // ✅ string, not null
            phone: "123456789",    // ✅ string, not null
            latitude: 0,
            longitude: 0,
        })
    console.log("nearGym:", nearGym.statusCode, nearGym.body)

    const farGym = await request(app.server)
        .post("/gyms")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Far Gym",
            description: "desc",
            phone: "123456789",
            latitude: 45,          // ✅ actually far (45 degrees ≈ 5000km)
            longitude: 45,
        })
    console.log("farGym:", farGym.statusCode, farGym.body)

    const response = await request(app.server)
        .get("/gyms/nearby")
        .query({ latitude: 0, longitude: 0 })
        .set("Authorization", `Bearer ${token}`)
        .send()
    console.log("nearby:", response.statusCode, response.body)

    expect(nearGym.statusCode).toEqual(201)
    expect(farGym.statusCode).toEqual(201)
    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
        expect.objectContaining({ title: "Near Gym" }),
    ])
})
})