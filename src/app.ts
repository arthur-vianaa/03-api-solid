import fastify from 'fastify'
import { usersRoutes } from './http/controllers/users/routes.js'
import { ZodError } from 'zod'
import { env } from './env/index.js'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { gymsRoutes } from './http/controllers/gyms/routes.js'
import { checkInsRoutes } from './http/controllers/check-ins/routes.js'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'refreshToken', signed: false, },
  sign: {expiresIn: '10m',},
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation Error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: log to DataDog/Sentry/NewRelic
  }

  return reply.status(500).send({ message: 'Internal Server Error.' })
})
