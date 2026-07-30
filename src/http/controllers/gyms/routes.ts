import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { search } from "./search.js";
import { nearby } from "./nearby.js";
import { createGym } from "./create-gym.js";
import { verifyUserRole } from "@/http/middlewares/verify-user-role.js";

export async function gymsRoutes(app: FastifyInstance) {  // no fp()
  app.addHook('onRequest', verifyJWT)  // stays scoped here only
  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGym)
}