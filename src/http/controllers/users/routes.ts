
import type { FastifyInstance } from "fastify";
import { register } from "./register.js";
import { authenticate } from "./authenticate.js";
import { profile } from "./profile.js";
import { refresh } from './refresh.js'
import { verifyJWT } from "../../middlewares/verify-jwt.js";

export const usersRoutes = async (app: FastifyInstance) => {
    app.post('/users', register) // criando um usuario
    app.post('/sessions', authenticate) // autenticando o usuario
    app.patch('/token/refresh', { onRequest: [verifyJWT] }, refresh) // atualizando o token
    
    // somente para usuarios autenticados
    app.get('/me', {onRequest: [verifyJWT]}, profile) // perfil do usuario
    
}
