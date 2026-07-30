
import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { createCheckIn } from "./create-check-in.js";
import { validateCheckIn } from "./validate.js";
import { metrics } from "./metrics.js";
import { history } from "./history.js";
import { verifyUserRole } from "@/http/middlewares/verify-user-role.js";

export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.get('/check-ins/history', history)
    app.get('/check-ins/metrics', metrics)
    
    app.post('/gyms/:gymId/check-ins', createCheckIn)
    app.patch('/check-ins/:checkInId/validate', { onRequest: [verifyUserRole('ADMIN')] }, validateCheckIn)

}

