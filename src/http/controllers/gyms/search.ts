import { z } from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case.js'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchGymQuerySchema.parse(request.query)

  const searchGymsUsCase = makeSearchGymsUseCase()

  const { gyms } = await searchGymsUsCase.execute({
    query: query,
    page,
  })


return reply.status(200).send({
    gyms,
})
}